"use client";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  imageUrl: string;
  chroma: number;
  decay: number;
  brushRadiusPxAt1440: number;
  rippleAmplitudePxAt1440: number;
  rippleFreq: number;
  rippleDamp: number;
  maxDPR: number;
};

export default function RippleReveal(p: Props) {
  const gl = useThree((s) => s.gl) as THREE.WebGLRenderer;
  const size = useThree((s) => s.size);
  const DPR = Math.min(p.maxDPR, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

  // make sure canvas is transparent; text is above
  useEffect(() => {
    gl.setClearColor(0x000000, 0); // alpha 0
  }, [gl]);

  // load portrait
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let mounted = true;
    new THREE.TextureLoader().load(
      p.imageUrl,
      (t) => {
        if (!mounted) return;
        t.minFilter = THREE.LinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
        setTex(t);
      },
      undefined,
      (error) => {
        setTex(null);
      }
    );
    return () => {
      mounted = false;
    };
  }, [p.imageUrl]);

  // ping-pong targets
  const rta = useRef<THREE.WebGLRenderTarget>();
  const rtb = useRef<THREE.WebGLRenderTarget>();

  const makeRT = (w: number, h: number) =>
    new THREE.WebGLRenderTarget(w, h, {
      // WebGL1-safe
      type: THREE.UnsignedByteType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });

  const [wh, setWH] = useState<[number, number]>([0, 0]);

  // offscreen scene
  const cam = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);
  const scene = useMemo(() => new THREE.Scene(), []);
  const quad = useMemo(
    () => new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ color: 0x111111 })),
    []
  );

  useEffect(() => {
    scene.add(quad);
    return () => {
      scene.remove(quad);
      quad.geometry.dispose();
      (quad.material as THREE.Material).dispose();
    };
  }, [scene, quad]);

  // uniforms (shared holders)
  const brushU = useRef<any>(null);
  const compU = useRef<any>(null);

  // materials
  const brushMat = useMemo(() => {
    const uniforms = {
      uPrev: { value: null as THREE.Texture | null },
      uDecay: { value: p.decay },
      uBrush: { value: new THREE.Vector2(-10, -10) }, // offscreen initially
      uBrushStrength: { value: 0.95 },
      uBrushRadius: { value: 0.12 },
      uDelta: { value: 0 },
    };
    brushU.current = uniforms;
    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: MASK_FRAG,
      depthTest: false,
      depthWrite: false,
      transparent: false,
    });
  }, [p.decay]);

  const compMat = useMemo(() => {
    const uniforms = {
      uMask: { value: null as THREE.Texture | null },
      uImage: { value: tex },
      uTime: { value: 0 },
      uChroma: { value: p.chroma },
      uRippleAmpPx: { value: p.rippleAmplitudePxAt1440 },
      uRippleFreq: { value: p.rippleFreq },
      uRippleDamp: { value: p.rippleDamp },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uHasImage: { value: tex ? 1 : 0 },
    };
    compU.current = uniforms;
    return new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: COMP_FRAG,
      depthTest: false,
      depthWrite: false,
      transparent: true, // allow DOM text to show
    });
  }, [tex, p.chroma, p.rippleAmplitudePxAt1440, p.rippleFreq, p.rippleDamp]);

  // pointer
  const pointer = useRef({ x: -10, y: -10, down: false });
  const prev = useRef({ x: -10, y: -10 });

  useEffect(() => {
    const el = (gl.domElement as HTMLCanvasElement);
    const rectToUV = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return {
        x: (e.clientX - r.left) / r.width,
        y: 1 - (e.clientY - r.top) / r.height,
      };
    };
    const down = (e: PointerEvent) => {
      pointer.current.down = true;
      const uv = rectToUV(e);
      prev.current = { x: uv.x, y: uv.y };
      pointer.current = { ...uv, down: true };
    };
    const up = () => (pointer.current.down = false);
    const move = (e: PointerEvent) => {
      const uv = rectToUV(e);
      prev.current = { x: pointer.current.x, y: pointer.current.y };
      pointer.current = { ...uv, down: pointer.current.down };
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointermove", move);
    el.style.touchAction = "none";
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointermove", move);
    };
  }, [gl]);

  // resize RTs
  useEffect(() => {
    const w = Math.max(1, Math.floor(size.width * DPR));
    const h = Math.max(1, Math.floor(size.height * DPR));
    rta.current?.dispose();
    rtb.current?.dispose();
    rta.current = makeRT(w, h);
    rtb.current = makeRT(w, h);
    setWH([w, h]);

    // scale brush
    const pxRadius = p.brushRadiusPxAt1440 * (w / 1440);
    const uvR = pxRadius / Math.max(w, h);
    if (brushU.current) brushU.current.uBrushRadius.value = uvR;

    if (compU.current) compU.current.uResolution.value.set(w, h);
  }, [size.width, size.height, DPR, p.brushRadiusPxAt1440]);

  useFrame((state, dt) => {
    if (!rta.current || !rtb.current) return;

    // PASS A — decay + brush into rta
    brushU.current.uPrev.value = rtb.current.texture;
    brushU.current.uDelta.value = Math.min(dt, 0.05);
    // slight smoothing
    const bx = THREE.MathUtils.lerp(prev.current.x, pointer.current.x, 0.3);
    const by = THREE.MathUtils.lerp(prev.current.y, pointer.current.y, 0.3);
    brushU.current.uBrush.value.set(bx, by);

    quad.material = brushMat;
    state.gl.setRenderTarget(rta.current);
    state.gl.render(scene, cam);
    state.gl.setRenderTarget(null);

    // PASS B — composite to screen
    compU.current.uMask.value = rta.current.texture;
    compU.current.uHasImage.value = tex ? 1 : 0;
    compU.current.uTime.value += dt;
    quad.material = compMat;
    state.gl.render(scene, cam);

    // swap
    const tmp = rta.current;
    rta.current = rtb.current!;
    rtb.current = tmp!;
  }, 1);

  return null;
}

const VERT = `
precision mediump float;
varying vec2 vUv;
void main() {
  // 'uv' and 'position' are provided by three.js automatically
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

// Pass A: mask accumulate + decay
const MASK_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uPrev;
uniform float uDecay;
uniform vec2  uBrush;
uniform float uBrushRadius;
uniform float uBrushStrength;
uniform float uDelta;

float g(float x){ return exp(-x*x); }

void main(){
  float prev = texture2D(uPrev, vUv).r;
  float mask = prev * pow(uDecay, max(uDelta * 60.0, 1.0));

  float d = distance(vUv, uBrush) / max(uBrushRadius, 1e-6);
  if(d < 2.0){
    mask = clamp(mask + g(d*1.1) * uBrushStrength, 0.0, 1.0);
  }
  gl_FragColor = vec4(mask, mask, mask, 1.0);
}
`;

// Pass B: show a visible gray gradient even if image missing; apply ripple + CA inside mask
const COMP_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uMask;
uniform sampler2D uImage;
uniform float uTime;
uniform float uChroma;
uniform float uRippleAmpPx;
uniform float uRippleFreq;
uniform float uRippleDamp;
uniform vec2  uResolution;
uniform int   uHasImage;

vec3 sampleCA(vec2 uv, float ca){
  vec2 off = vec2(ca, 0.0);
  float r = texture2D(uImage, uv + off).r;
  float g = texture2D(uImage, uv).g;
  float b = texture2D(uImage, uv - off).b;
  return vec3(r,g,b);
}

void main(){
  float mask = texture2D(uMask, vUv).r;

  // visible test bg (you should SEE this immediately)
  vec3 bg = mix(vec3(0.08), vec3(0.18), vUv.y);

  vec3 col = bg;
  if(uHasImage == 1){
    vec2 texel = 1.0 / uResolution;
    float mL = texture2D(uMask, vUv - vec2(texel.x, 0.0)).r;
    float mR = texture2D(uMask, vUv + vec2(texel.x, 0.0)).r;
    float mT = texture2D(uMask, vUv + vec2(0.0, texel.y)).r;
    float mB = texture2D(uMask, vUv - vec2(0.0, texel.y)).r;
    vec2 grad = vec2(mR - mL, mT - mB);

    float pxScale = uResolution.x / 1440.0;
    float ampUV = (uRippleAmpPx * pxScale) / uResolution.x;

    float ring = sin(uTime * 6.0 + (mR+mL+mT+mB) * uRippleFreq) * exp(-length(grad) * uRippleDamp);
    vec2 ripple = grad * ampUV * 12.0 + ring * ampUV * 0.8;

    vec2 uv = vUv + ripple * mask;
    float ca = uChroma * mask;
    col = sampleCA(uv, ca);
  }

  vec3 outCol = mix(bg, col, smoothstep(0.0, 1.0, mask));
  gl_FragColor = vec4(outCol, 1.0);
}
`;
