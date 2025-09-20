"use client";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";

type TextElement = {
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
  font?: string;
  fontWeight?: string | number;
  letterSpacing?: string;
  lineHeight?: string;
};

type Props = {
  imageUrl: string;
  text?: string;
  textElements?: TextElement[];
  chroma: number;
  decay: number;
  brushRadiusPxAt1440: number;
  rippleAmplitudePxAt1440: number;
  rippleFreq: number;
  rippleDamp: number;
  maxDPR: number;
  revealEnabled?: boolean;
  // Water ripple controls
  waterRippleSensitivity?: number;
  waterRippleStrength?: number;
  waterRippleRadius?: number;
  waterRippleLifetime?: number;
};

export default function RippleReveal(p: Props) {
  const gl = useThree((s) => s.gl) as THREE.WebGLRenderer;
  const size = useThree((s) => s.size);
  const DPR = Math.min(p.maxDPR, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);

  // make sure canvas is transparent; text is above
  useEffect(() => {
    try {
      gl.setClearColor(0x000000, 0); // alpha 0
    } catch (error) {
      console.warn('WebGL clear color error:', error);
    }
  }, [gl]);

  // load portrait
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [textTex, setTextTex] = useState<THREE.Texture | null>(null);
  
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

  // create text texture
  useEffect(() => {
    if (!p.text && !p.textElements) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Larger canvas for multiple text elements
    canvas.width = 1200;
    canvas.height = 600;
    
    // Set background to match website color
    ctx.fillStyle = '#0B0B0B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (p.textElements && p.textElements.length > 0) {
      // Draw multiple text elements
      p.textElements.forEach(element => {
        // Set text style for this element
        ctx.fillStyle = element.color;
        const fontWeight = element.fontWeight || 'bold';
        const letterSpacing = element.letterSpacing || 'normal';
        const fontFamily = element.font || 'Arial, sans-serif';
        
        ctx.font = `${fontWeight} ${element.size}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Set letter spacing if specified
        if (letterSpacing !== 'normal') {
          ctx.letterSpacing = letterSpacing;
        }
        
        // Add text shadow for depth (only for large text)
        if (element.size > 100) {
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        }
        
        // Draw text at specified position
        ctx.fillText(element.text, element.x, element.y);
        
        // Reset shadow and letter spacing for next element
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.letterSpacing = 'normal';
      });
    } else if (p.text) {
      // Draw single text element (fallback)
      ctx.fillStyle = '#FF5353';
      ctx.font = 'bold 120px Climate Crisis, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '0.05em';
      
      // Add text shadow for depth
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Draw text centered
      ctx.fillText(p.text, canvas.width / 2, canvas.height / 2);
    }
    
    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = false;
    
    setTextTex(texture);
    
    return () => {
      texture.dispose();
    };
  }, [p.text, p.textElements]);

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
      uTrail: { value: new THREE.Vector2(-10, -10) }, // trail position
      uTrailStrength: { value: 0.0 }, // trail opacity
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
      uText: { value: textTex },
      uTime: { value: 0 },
      uChroma: { value: p.chroma },
      uRippleAmpPx: { value: p.rippleAmplitudePxAt1440 },
      uRippleFreq: { value: p.rippleFreq },
      uRippleDamp: { value: p.rippleDamp },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uHasImage: { value: tex ? 1 : 0 },
      uHasText: { value: textTex ? 1 : 0 },
      uRevealEnabled: { value: p.revealEnabled !== false ? 1 : 0 },
      uWaterRipples: { value: new Float32Array(80) }, // 20 ripples * 4 values (x, y, time, strength)
      uWaterRippleCount: { value: 0 },
      uWaterRippleRadius: { value: p.waterRippleRadius || 0.08 },
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
  }, [tex, textTex, p.chroma, p.rippleAmplitudePxAt1440, p.rippleFreq, p.rippleDamp]);

  // pointer with trail tracking
  const pointer = useRef({ x: -10, y: -10, down: false });
  const prev = useRef({ x: -10, y: -10 });
  const trail = useRef<Array<{x: number, y: number, time: number}>>([]);
  const maxTrailLength = 8;
  
  // Water ripple state
  const waterRipples = useRef<Array<{x: number, y: number, time: number, strength: number}>>([]);
  const maxWaterRipples = 20;

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
      // Clear trail on new interaction
      trail.current = [{ x: uv.x, y: uv.y, time: Date.now() }];
    };
    const up = () => {
      pointer.current.down = false;
      // Keep trail for a moment after release
      setTimeout(() => {
        trail.current = [];
      }, 200);
    };
    const move = (e: PointerEvent) => {
      const uv = rectToUV(e);
      prev.current = { x: pointer.current.x, y: pointer.current.y };
      pointer.current = { ...uv, down: pointer.current.down };
      
      // Add to trail
      trail.current.push({ x: uv.x, y: uv.y, time: Date.now() });
      
      // Add water ripple on movement
      const movementDistance = Math.sqrt(
        Math.pow(uv.x - prev.current.x, 2) + Math.pow(uv.y - prev.current.y, 2)
      );
      
      const sensitivity = p.waterRippleSensitivity || 0.002;
      const maxStrength = p.waterRippleStrength || 0.3;
      
      if (movementDistance > sensitivity) {
        waterRipples.current.push({
          x: uv.x,
          y: uv.y,
          time: Date.now(),
          strength: Math.min(movementDistance * 3, maxStrength)
        });
        
        // Limit water ripples
        if (waterRipples.current.length > maxWaterRipples) {
          waterRipples.current = waterRipples.current.slice(-maxWaterRipples);
        }
      }
      
      // Limit trail length
      if (trail.current.length > maxTrailLength) {
        trail.current = trail.current.slice(-maxTrailLength);
      }
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
    
    try {

    // PASS A — decay + brush into rta
    brushU.current.uPrev.value = rtb.current.texture;
    brushU.current.uDelta.value = Math.min(dt, 0.05);
    
    // Calculate smooth brush position
    const bx = THREE.MathUtils.lerp(prev.current.x, pointer.current.x, 0.3);
    const by = THREE.MathUtils.lerp(prev.current.y, pointer.current.y, 0.3);
    brushU.current.uBrush.value.set(bx, by);
    
    // Calculate trail position and strength
    let trailX = -10, trailY = -10, trailStrength = 0.0;
    if (trail.current.length > 1) {
      // Use the second-to-last position for trail (slightly behind cursor)
      const trailPoint = trail.current[trail.current.length - 2];
      trailX = trailPoint.x;
      trailY = trailPoint.y;
      
      // Calculate trail strength based on movement speed and recency
      const timeDiff = Date.now() - trailPoint.time;
      const movementDistance = Math.sqrt(
        Math.pow(pointer.current.x - trailPoint.x, 2) + 
        Math.pow(pointer.current.y - trailPoint.y, 2)
      );
      
      // Trail strength decreases with time and increases with movement speed
      trailStrength = Math.max(0, Math.min(0.6, 
        (1.0 - timeDiff / 100) * (movementDistance * 10)
      ));
    }
    
    brushU.current.uTrail.value.set(trailX, trailY);
    brushU.current.uTrailStrength.value = trailStrength;

    (quad.material as any) = brushMat;
    state.gl.setRenderTarget(rta.current);
    state.gl.render(scene, cam);
    state.gl.setRenderTarget(null);

    // Update water ripples (remove old ones)
    const currentTime = Date.now();
    const lifetime = p.waterRippleLifetime || 1500;
    waterRipples.current = waterRipples.current.filter(ripple => currentTime - ripple.time < lifetime);
    
    // Convert water ripples to array for shader
    const rippleArray = new Float32Array(80);
    let rippleCount = 0;
    waterRipples.current.forEach((ripple, index) => {
      if (index < 20) {
        rippleArray[index * 4] = ripple.x;
        rippleArray[index * 4 + 1] = ripple.y;
        rippleArray[index * 4 + 2] = (currentTime - ripple.time) / lifetime; // normalized age
        rippleArray[index * 4 + 3] = ripple.strength;
        rippleCount++;
      }
    });

    // PASS B — composite to screen
    compU.current.uMask.value = rta.current.texture;
    compU.current.uHasImage.value = tex ? 1 : 0;
    compU.current.uHasText.value = textTex ? 1 : 0;
    compU.current.uRevealEnabled.value = p.revealEnabled !== false ? 1 : 0;
    compU.current.uWaterRipples.value = rippleArray;
    compU.current.uWaterRippleCount.value = rippleCount;
    compU.current.uTime.value += dt;
    (quad.material as any) = compMat;
    state.gl.render(scene, cam);

    // swap
    const tmp = rta.current;
    rta.current = rtb.current!;
    rtb.current = tmp!;
    
    } catch (error) {
      console.warn('RippleReveal render error:', error);
    }
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

// Pass A: mask accumulate + decay with trail
const MASK_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uPrev;
uniform float uDecay;
uniform vec2  uBrush;
uniform float uBrushRadius;
uniform float uBrushStrength;
uniform float uDelta;
uniform vec2  uTrail;
uniform float uTrailStrength;

float g(float x){ return exp(-x*x); }

void main(){
  float prev = texture2D(uPrev, vUv).r;
  float mask = prev * pow(uDecay, max(uDelta * 60.0, 1.0));

  // Main brush
  float d = distance(vUv, uBrush) / max(uBrushRadius, 1e-6);
  if(d < 2.0){
    mask = clamp(mask + g(d*1.1) * uBrushStrength, 0.0, 1.0);
  }
  
  // Trail brush (tapered and reduced opacity)
  if(uTrailStrength > 0.0){
    float trailD = distance(vUv, uTrail) / max(uBrushRadius * 0.7, 1e-6);
    if(trailD < 1.5){
      float trailMask = g(trailD*1.3) * uBrushStrength * uTrailStrength * 0.5;
      mask = clamp(mask + trailMask, 0.0, 1.0);
    }
  }
  
  gl_FragColor = vec4(mask, mask, mask, 1.0);
}
`;

// Pass B: show background with text overlay, apply ripple + CA inside mask
const COMP_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uMask;
uniform sampler2D uImage;
uniform sampler2D uText;
uniform float uTime;
uniform float uChroma;
uniform float uRippleAmpPx;
uniform float uRippleFreq;
uniform float uRippleDamp;
uniform vec2  uResolution;
uniform int   uHasImage;
uniform int   uHasText;
uniform int   uRevealEnabled;
uniform float uWaterRipples[80]; // 20 ripples * 4 values
uniform int   uWaterRippleCount;
uniform float uWaterRippleRadius;

vec3 sampleCA(vec2 uv, float ca){
  vec2 off = vec2(ca, 0.0);
  float r = texture2D(uImage, uv + off).r;
  float g = texture2D(uImage, uv).g;
  float b = texture2D(uImage, uv - off).b;
  return vec3(r,g,b);
}

void main(){
  float mask = texture2D(uMask, vUv).r;

  // Website background color
  vec3 bg = vec3(0.043, 0.043, 0.043); // #0B0B0B

  // Sample text texture at original size (NO water ripples on text)
  vec3 textCol = bg;
  if(uHasText == 1){
    // Map UV coordinates directly to text texture (no scaling, no distortion)
    vec2 textUV = vUv;
    if(textUV.x >= 0.0 && textUV.x <= 1.0 && textUV.y >= 0.0 && textUV.y <= 1.0){
      textCol = texture2D(uText, textUV).rgb;
    }
  }

  vec3 col = textCol;
  
  // Only apply reveal effect if enabled
  if(uRevealEnabled == 1 && uHasImage == 1){
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

    // Only cursor-responsive water ripples (no continuous movement)
    vec2 cursorRipples = vec2(0.0);
    for(int i = 0; i < 20; i++) {
      if(i >= uWaterRippleCount) break;
      
      float rippleX = uWaterRipples[i * 4];
      float rippleY = uWaterRipples[i * 4 + 1];
      float rippleAge = uWaterRipples[i * 4 + 2];
      float rippleStrength = uWaterRipples[i * 4 + 3];
      
      if(rippleAge < 1.0) { // Only active ripples
        float dist = distance(vUv, vec2(rippleX, rippleY));
        float rippleRadius = uWaterRippleRadius * (1.0 - rippleAge);
        
        if(dist < rippleRadius) {
          float rippleIntensity = (1.0 - dist / rippleRadius) * (1.0 - rippleAge) * rippleStrength;
          vec2 rippleDir = normalize(vUv - vec2(rippleX, rippleY));
          cursorRipples += rippleDir * rippleIntensity * 0.02; // Much gentler ripple effect
        }
      }
    }
    
    vec2 totalRipple = ripple + cursorRipples;
    vec2 uv = vUv + totalRipple * mask;
    float ca = uChroma * mask;
    col = sampleCA(uv, ca);
  }

  // When reveal is disabled, always show text; when enabled, use mask to blend
  vec3 outCol;
  if(uRevealEnabled == 1) {
    // Normal reveal behavior: mix text and image based on mask
    outCol = mix(textCol, col, smoothstep(0.0, 1.0, mask));
  } else {
    // Reveal disabled: always show text (no image reveal)
    outCol = textCol;
  }
  
  gl_FragColor = vec4(outCol, 1.0);
}
`;
