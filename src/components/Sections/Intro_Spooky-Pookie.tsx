"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

export default function SpectralGhostSection() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const preloaderRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const paneHostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // -------- Preloader helpers --------
    const preloaderEl = preloaderRef.current!;
    const contentEl = contentRef.current!;
    const progressEl = progressRef.current!;
    const bump = (n: number, total = 5) => {
      const pct = Math.min(n, total) / total * 100;
      progressEl.style.width = `${pct}%`;
    };
    const complete = (canvas: HTMLCanvasElement) => {
      bump(5);
        setTimeout(() => {
        preloaderEl.classList.add("sg-fade-out");
        contentEl.classList.add("sg-fade-in");
        canvas.classList.add("sg-canvas-in");
        setTimeout(() => (preloaderEl.style.display = "none"), 900);
      }, 600);
    };

    // -------- Three.js setup --------
    const scene = new THREE.Scene();
    const w = mountRef.current.clientWidth;
    const h = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    renderer.domElement.classList.add("sg-canvas");

    // Post FX
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.3, 1.25, 0.0);
    composer.addPass(bloom);

    // Analog post shader (grain/bleed/etc.)
    const analogDecayShader = {
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0.0 },
        uResolution: { value: new THREE.Vector2(w, h) },
        uAnalogGrain: { value: 0.4 },
        uAnalogBleeding: { value: 1.0 },
        uAnalogVSync: { value: 1.0 },
        uAnalogScanlines: { value: 1.0 },
        uAnalogVignette: { value: 1.0 },
        uAnalogJitter: { value: 0.4 },
        uAnalogIntensity: { value: 0.6 },
        uLimboMode: { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime,uAnalogGrain,uAnalogBleeding,uAnalogVSync,uAnalogScanlines,uAnalogVignette,uAnalogJitter,uAnalogIntensity,uLimboMode;
        varying vec2 vUv;
        float rnd(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
        float gauss(float z){return exp(-(z*z)/(2.0*0.25))/(sqrt(6.28318)*0.5);}
        void main(){
          vec2 uv=vUv; float t=uTime*1.8;
          if(uAnalogJitter>0.0){
            uv.x += (rnd(vec2(floor(t*60.0))) - .5) * 0.003 * uAnalogJitter * uAnalogIntensity;
            uv.y += (rnd(vec2(floor(t*30.0)+1.0)) - .5) * 0.001 * uAnalogJitter * uAnalogIntensity;
          }
          if(uAnalogVSync>0.0){
            float roll=sin(t*2.0 + uv.y*100.0)*0.02*uAnalogVSync*uAnalogIntensity;
            float chance=step(0.95, rnd(vec2(floor(t*4.0))));
            uv.y += roll*chance;
          }
          vec4 col=texture2D(tDiffuse, uv);
          if(uAnalogBleeding>0.0){
            float amt=0.012*uAnalogBleeding*uAnalogIntensity;
            float ph=t*1.5+uv.y*20.0;
            vec2 ro=vec2(sin(ph)*amt,0.0);
            vec2 bo=vec2(-sin(ph*1.1)*amt*.8,0.0);
            col=vec4(texture2D(tDiffuse,uv+ro).r, texture2D(tDiffuse,uv).g, texture2D(tDiffuse,uv+bo).b, col.a);
          }
          if(uAnalogGrain>0.0){
            float n = rnd(uv + floor(vec2(t*60.0)));
            n = gauss(n);
            vec3 g = vec3(n) * 0.075 * uAnalogGrain * uAnalogIntensity;
            g *= (1.0 - col.rgb);
            col.rgb += g;
          }
          if(uAnalogScanlines>0.0){
            float f = 600.0 + uAnalogScanlines*400.0;
            float s = sin(uv.y*f)*0.5+0.5;
            col.rgb *= (1.0 - 0.1*s*uAnalogScanlines*uAnalogIntensity);
          }
          if(uAnalogVignette>0.0){
            vec2 p = (uv-0.5)*2.0;
            float v = 1.0 - dot(p,p)*0.3*uAnalogVignette*uAnalogIntensity;
            col.rgb *= v;
          }
          if(uLimboMode>.5){ float g=dot(col.rgb, vec3(.299,.587,.114)); col.rgb=vec3(g); }
          gl_FragColor=col;
        }
      `,
    };
    const analogPass = new ShaderPass(analogDecayShader as any);
    composer.addPass(analogPass);
    composer.addPass(new OutputPass());

    // -------- Reveal veil (stronger + guaranteed fullscreen) --------
    // Keep it HUGE and always facing camera so it fills view.
  const params = {
      revealRadius: 70,       // bigger spotlight
      fadeStrength: 2.0,
      baseOpacity: 0.65,      // <— darker outside area so reveal is obvious
      revealOpacity: 0.02,    // <— near ghost is almost clear
    followSpeed: 0.075,
    wobbleAmount: 0.35,
    floatSpeed: 1.6,
    movementThreshold: 0.07,
      fireflyGlowIntensity: 2.2,
    fireflySpeed: 0.04,
      eyeGlowResponse: 0.31,
      eyeGlowDecay: 0.95,
    };

    const atmosphereMat = new THREE.ShaderMaterial({
      uniforms: {
        ghostPosition: { value: new THREE.Vector3(0, 0, 0) },
        revealRadius:  { value: params.revealRadius },
        fadeStrength:  { value: params.fadeStrength },
        baseOpacity:   { value: params.baseOpacity },
        revealOpacity: { value: params.revealOpacity },
        time:          { value: 0 },
      },
      vertexShader: `
        varying vec3 vWorld;
        void main(){
          vWorld = (modelMatrix*vec4(position,1.0)).xyz;
          gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform vec3  ghostPosition;
        uniform float revealRadius, fadeStrength, baseOpacity, revealOpacity, time;
        varying vec3 vWorld;
        void main(){
          float d = distance(vWorld.xy, ghostPosition.xy);
          float dyn = revealRadius + sin(time*2.0)*5.0;
          float r = smoothstep(dyn*0.2, dyn, d);
          r = pow(r, fadeStrength);
          float a = mix(revealOpacity, baseOpacity, r);
          // almost-black so it DARKENS whatever is behind the canvas
          gl_FragColor = vec4(0.0, 0.0, 0.0, a);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const atmosphere = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), atmosphereMat);
    atmosphere.position.z = -20;
    atmosphere.renderOrder = -100; // draw first
    scene.add(atmosphere);

    // Lights
    scene.add(new THREE.AmbientLight(0x0a0a2e, 0.08));
    const rim1 = new THREE.DirectionalLight(0x4a90e2, 1.6); rim1.position.set(-8, 6, -4); scene.add(rim1);
    const rim2 = new THREE.DirectionalLight(0x50e3c2, 1.1); rim2.position.set(8, -4, -6); scene.add(rim2);

    // -------- Ghost (body + eyes) --------
    const ghostGroup = new THREE.Group(); scene.add(ghostGroup);
    const ghostGeo = new THREE.SphereGeometry(2, 40, 40);
    { // wavy hem
      const pos = ghostGeo.attributes.position as THREE.BufferAttribute;
      for (let i=0;i<pos.count;i++){ const y=pos.getY(i); if (y<-0.2){
        const x=pos.getX(i), z=pos.getZ(i);
        const n = Math.sin(x*5)*0.35 + Math.cos(z*4)*0.25 + Math.sin((x+z)*3)*0.15;
        pos.setY(i, -2.0 + n);
      }} ghostGeo.computeVertexNormals();
    }
    const ghostMat = new THREE.MeshStandardMaterial({
      color: 0x0f2027, transparent: true, opacity: 0.88,
      emissive: 0xff4500, emissiveIntensity: 5.8,
      roughness: 0.02, metalness: 0.0, side: THREE.DoubleSide, alphaTest: 0.1,
    });
    const ghostBody = new THREE.Mesh(ghostGeo, ghostMat); ghostGroup.add(ghostBody);

    // Eyes (inner + outer glow)
    const makeEyeSet = () => {
      const g = new THREE.Group(); ghostGroup.add(g);
      const socketGeo = new THREE.SphereGeometry(0.45,16,16);
      const socketMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const leftS = new THREE.Mesh(socketGeo, socketMat); leftS.position.set(-0.7,0.6,1.9); leftS.scale.set(1.1,1,0.6); g.add(leftS);
      const rightS = leftS.clone(); rightS.position.x *= -1; g.add(rightS);

      const eyeGeo = new THREE.SphereGeometry(0.3,12,12);
      const mk = () => new THREE.Mesh(eyeGeo, new THREE.MeshBasicMaterial({ color: 0x00ff80, transparent:true, opacity:0 }));
      const left = mk(); left.position.set(-0.7,0.6,2.0);
      const right = mk(); right.position.set(0.7,0.6,2.0);
      g.add(left,right);

      const outerGeo = new THREE.SphereGeometry(0.525,12,12);
      const mkO = () => new THREE.Mesh(outerGeo, new THREE.MeshBasicMaterial({ color: 0x00ff80, transparent:true, opacity:0, side:THREE.BackSide }));
      const leftO = mkO(); leftO.position.set(-0.7,0.6,1.95);
      const rightO = mkO(); rightO.position.set(0.7,0.6,1.95);
      g.add(leftO,rightO);

      return {
        setOpacity(o:number){
          o = THREE.MathUtils.clamp(o,0,1);
          (left.material as THREE.MeshBasicMaterial).opacity = o;
          (right.material as THREE.MeshBasicMaterial).opacity = o;
          (leftO.material as THREE.MeshBasicMaterial).opacity = o*0.3;
          (rightO.material as THREE.MeshBasicMaterial).opacity = o*0.3;
        },
        setColor(hex:number){
          [(left.material as any),(right.material as any),(leftO.material as any),(rightO.material as any)].forEach(m=>m.color.setHex(hex));
        }
      };
    };
    const eyes = makeEyeSet();

    // Fireflies (quick)
    const fireflyGroup = new THREE.Group(); scene.add(fireflyGroup);
    const fireflies: THREE.Object3D[] = [];
    for (let i=0;i<20;i++){
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.02,2,2), new THREE.MeshBasicMaterial({ color: 0xffff44, transparent:true, opacity:0.9 }));
      core.position.set((Math.random()-.5)*40,(Math.random()-.5)*30,(Math.random()-.5)*20);
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.08,8,8), new THREE.MeshBasicMaterial({ color: 0xffff88, transparent:true, opacity:0.4, side:THREE.BackSide }));
      core.add(glow);
      const light = new THREE.PointLight(0xffff44, 0.8, 3, 2); core.add(light);
      (core as any).userData = { vel:new THREE.Vector3((Math.random()-.5)*params.fireflySpeed,(Math.random()-.5)*params.fireflySpeed,(Math.random()-.5)*params.fireflySpeed), glowMat:glow.material, coreMat:core.material, light, phase:Math.random()*Math.PI*2 };
      fireflyGroup.add(core); fireflies.push(core);
    }

    bump(1);

    // Mouse → ghost follow
    const mouse = new THREE.Vector2(), prevMouse = new THREE.Vector2(), mouseSpeed = new THREE.Vector2();
    let isMouseMoving=false, lastUpdate=0, moveTimer:any=null;
    const onMouse = (e: MouseEvent) => {
      const now = performance.now(); if (now - lastUpdate < 16) return;
      prevMouse.copy(mouse);
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseSpeed.subVectors(mouse, prevMouse);
      isMouseMoving = true; clearTimeout(moveTimer); moveTimer=setTimeout(()=>isMouseMoving=false, 80);
      lastUpdate = now;
    };
    window.addEventListener("mousemove", onMouse);

    // Resize
    const onResize = () => {
      if (!mountRef.current) return;
      const W = mountRef.current.clientWidth, H = mountRef.current.clientHeight;
      camera.aspect = W/H; camera.updateProjectionMatrix();
      renderer.setSize(W,H); composer.setSize(W,H); bloom.setSize(W,H);
      (analogPass.uniforms as any).uResolution.value.set(W,H);
    };
    const ro = new ResizeObserver(onResize); ro.observe(mountRef.current);

    // Warm up & reveal
    setTimeout(() => complete(renderer.domElement), 350);

    // Animate
    let time=0, last=0, currentMove=0, lastParticle=0;
    const animate = (ts:number) => {
      const dt = Math.min(100, ts-last); last = ts;
      requestAnimationFrame(animate);
      time += (dt/16.67) * 0.01;

      atmosphereMat.uniforms.time.value = time;
      (analogPass.uniforms as any).uTime.value = time;

      // Keep veil facing camera & huge
      atmosphere.quaternion.copy(camera.quaternion);
      atmosphere.position.z = -20;

      // Follow cursor
      const targetX = mouse.x * 11, targetY = mouse.y * 7;
      const prev = ghostGroup.position.clone();
      ghostGroup.position.x += (targetX - ghostGroup.position.x) * params.followSpeed;
      ghostGroup.position.y += (targetY - ghostGroup.position.y) * params.followSpeed;
      atmosphereMat.uniforms.ghostPosition.value.copy(ghostGroup.position);

      // Movement
      const moved = prev.distanceTo(ghostGroup.position);
      currentMove = currentMove * params.eyeGlowDecay + moved * (1 - params.eyeGlowDecay);

      // Float + wobble
      ghostGroup.position.y += Math.sin(time*params.floatSpeed*1.5)*0.03
                             + Math.cos(time*params.floatSpeed*0.7)*0.018
                             + Math.sin(time*params.floatSpeed*2.3)*0.008;

      const dir = new THREE.Vector2(targetX-ghostGroup.position.x, targetY-ghostGroup.position.y).normalize();
      ghostBody.rotation.z = ghostBody.rotation.z*0.95 + -dir.x*0.1*params.wobbleAmount*0.05;
      ghostBody.rotation.x = ghostBody.rotation.x*0.95 +  dir.y*0.1*params.wobbleAmount*0.05;
      ghostBody.rotation.y = Math.sin(time*1.4)*0.05*params.wobbleAmount;

      // Eyes by movement
      const moving = currentMove > params.movementThreshold;
      const curr = (ghostBody.material as THREE.MeshStandardMaterial).opacity; // noop, keep ts happy
      const currEye = (ghostBody.material as any)._tmpEyeOpacity ?? 0;
      const nextEye = currEye + ((moving?1:0) - currEye) * params.eyeGlowResponse;
      (ghostBody.material as any)._tmpEyeOpacity = nextEye;
      eyes.setOpacity(nextEye);

      // Fireflies motion
      fireflies.forEach((ff:any) => {
        const ud = ff.userData;
        ud.vel.addScalar((Math.random() - .5)*0.001);
        ud.vel.clampLength(0, params.fireflySpeed);
        ff.position.add(ud.vel);
        const ph = time + ud.phase, pulse = Math.sin(ph*3.0)*0.4 + 0.6;
        ud.glowMat.opacity = params.fireflyGlowIntensity * 0.4 * pulse;
        ud.coreMat.opacity = params.fireflyGlowIntensity * 0.9 * pulse;
        ud.light.intensity = params.fireflyGlowIntensity * 0.8 * pulse;
        if (Math.abs(ff.position.x)>30) ud.vel.x *= -0.5;
        if (Math.abs(ff.position.y)>20) ud.vel.y *= -0.5;
        if (Math.abs(ff.position.z)>15) ud.vel.z *= -0.5;
      });

      composer.render();
    };
    requestAnimationFrame(animate);

    // --------- Tweakpane (settings UI) ---------
    (async () => {
      try {
        const { Pane } = await import("tweakpane");
        const pane = new Pane({ title: "Spectral Ghost", container: paneHostRef.current!, expanded: true });
        pane.element.style.position = "absolute";
        pane.element.style.top = "20px";
        pane.element.style.right = "20px";
        pane.element.style.zIndex = "40";

        const reveal = (pane as any).addFolder({ title: "Background Reveal", expanded: true });
        reveal.addBinding(params, "revealRadius", { label: "Radius", min: 10, max: 140, step: 2 })
          .on("change", (ev:any) => (atmosphereMat.uniforms.revealRadius.value = ev.value));
        reveal.addBinding(params, "baseOpacity", { label: "Base Dark", min: 0, max: 0.95, step: 0.01 })
          .on("change", (ev:any) => (atmosphereMat.uniforms.baseOpacity.value = ev.value));
        reveal.addBinding(params, "revealOpacity", { label: "Spotlight Opac.", min: 0, max: 0.5, step: 0.01 })
          .on("change", (ev:any) => (atmosphereMat.uniforms.revealOpacity.value = ev.value));
        reveal.addBinding(params, "fadeStrength", { label: "Edge Falloff", min: 0.5, max: 3, step: 0.1 })
          .on("change", (ev:any) => (atmosphereMat.uniforms.fadeStrength.value = ev.value));

        const motion = (pane as any).addFolder({ title: "Motion", expanded: false });
        motion.addBinding(params, "followSpeed", { label: "Follow", min: 0.01, max: 0.2, step: 0.005 });
        motion.addBinding(params, "wobbleAmount", { label: "Wobble", min: 0, max: 1, step: 0.05 });
        motion.addBinding(params, "floatSpeed", { label: "Float", min: 0.2, max: 3, step: 0.05 });

        const eyesFolder = (pane as any).addFolder({ title: "Eyes", expanded: false });
        eyesFolder.addBinding(params, "eyeGlowResponse", { label: "Response", min: 0.05, max: 0.6, step: 0.01 });
        eyesFolder.addBinding(params, "eyeGlowDecay", { label: "Decay", min: 0.9, max: 0.99, step: 0.01 });
      } catch (e) {
        // if tweakpane not installed, silently ignore
        console.warn("Tweakpane not available. Run `npm i tweakpane`.", e);
      }
    })();

    // Cleanup
    return () => {
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
      composer.dispose();
      renderer.dispose();
      mountRef.current?.contains(renderer.domElement) && mountRef.current.removeChild(renderer.domElement);
      scene.traverse((obj:any) => {
        obj.geometry?.dispose?.();
        const m = obj.material;
        if (Array.isArray(m)) m.forEach((mm:any)=>mm.dispose?.()); else m?.dispose?.();
      });
    };
  }, []);

  return (
    <section className="sg-root">
      {/* Background layer so reveal is obvious */}
      <div
        className="sg-bg"
        // replace with your portrait/texture to really see the reveal
        style={{ backgroundImage: 'url(/your-background-placeholder.jpg)' }}
      />

      {/* Preloader */}
      <div ref={preloaderRef} className="sg-preloader">
        <div className="sg-pre-content">
          <div className="sg-ghost-loader">
            <svg className="sg-ghost-svg" height="80" width="80" viewBox="0 0 512 512">
              <path className="sg-ghost-body" d="m508.374 432.802s-46.6-39.038-79.495-275.781c-8.833-87.68-82.856-156.139-172.879-156.139-90.015 0-164.046 68.458-172.879 156.138-32.895 236.743-79.495 275.782-79.495 275.782-15.107 25.181 20.733 28.178 38.699 27.94 35.254-.478 35.254 40.294 70.516 40.294 35.254 0 35.254-35.261 70.508-35.261s37.396 45.343 72.65 45.343 37.389-45.343 72.651-45.343c35.254 0 35.254 35.261 70.508 35.261s35.27-40.772 70.524-40.294c17.959.238 53.798-2.76 38.692-27.94z" fill="white"/>
              <circle className="sg-ghost-eye" cx="208" cy="225" r="22" fill="black"/>
              <circle className="sg-ghost-eye" cx="297" cy="225" r="22" fill="black"/>
            </svg>
          </div>
          <div className="sg-loading-text">Spectral Ghost</div>
          <div className="sg-loading-progress"><div ref={progressRef} className="sg-progress-bar"/></div>
        </div>
      </div>

      {/* Canvas mount + pane host */}
      <div ref={mountRef} className="sg-canvas-wrap" />
      <div ref={paneHostRef} className="sg-pane-host" />

      {/* Optional overlay content */}
      <div ref={contentRef} className="sg-content">
        <div className="sg-quote-wrap">
          <h1 className="sg-quote">
            Veil of Dust<br/>Trail of Ash<br/>Heart of Ice
          </h1>
          <span className="sg-author">Whispers through memory</span>
        </div>
      </div>

      <style jsx global>{`
        .sg-root { position: relative; width: 100%; height: 100svh; overflow: hidden; background:#111; }
        .sg-bg { position:absolute; inset:0; background-size:cover; background-position:center; z-index:0; }
        .sg-canvas-wrap { position:absolute; inset:0; z-index:2; }
        .sg-canvas { position:absolute; inset:0; opacity:0; transition:opacity 1.2s ease-in; }
        .sg-canvas.sg-canvas-in { opacity:1; }
        .sg-content { position:absolute; inset:0; z-index:3; display:grid; place-items:center; padding:20px; text-align:center; color:#e0e0e0; opacity:0; transition:opacity 1.2s ease-in; pointer-events:none; }
        .sg-content.sg-fade-in{ opacity:1; }
        .sg-quote-wrap{ max-width:90%; }
        .sg-quote{ font-family: ui-sans-serif, system-ui; font-weight:600; text-transform:uppercase; letter-spacing:.02em; font-size:clamp(28px,6vw,84px); line-height:1.2; margin-bottom:5vh; }
        .sg-author{ font: 12px ui-monospace, SFMono-Regular, Menlo, monospace; text-transform:uppercase; opacity:.7; }
        .sg-preloader{ position:fixed; inset:0; background:linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 50%,#0a0a0a 100%); display:grid; place-items:center; z-index:5; opacity:1; transition:opacity .9s ease-out; }
        .sg-preloader.sg-fade-out{ opacity:0; pointer-events:none; }
        .sg-pre-content{ text-align:center; color:#e0e0e0; }
        .sg-ghost-loader{ width:64px; height:64px; margin:0 auto 24px; display:grid; place-items:center; }
        .sg-ghost-svg{ filter:drop-shadow(0 0 20px rgba(255,255,255,.3)); animation:sg-float 3s ease-in-out infinite; }
        .sg-ghost-eye{ animation:sg-eye 2s ease-in-out infinite; transform-origin:center; }
        @keyframes sg-float{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes sg-eye{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
        .sg-loading-text{ font: 12px ui-monospace, SFMono-Regular, Menlo, monospace; text-transform:uppercase; opacity:1; margin-bottom:12px; animation:sg-text 2s ease-in-out infinite; }
        @keyframes sg-text{ 0%,100%{opacity:1} 50%{opacity:.1} }
        .sg-loading-progress{ width:96px; height:1px; margin:0 auto; border-radius:1px; overflow:hidden; }
        .sg-progress-bar{ height:100%; background:linear-gradient(90deg,#00ff80,#00cc66); opacity:.25; width:0%; transition:width .8s ease; }
        .sg-pane-host{ position:absolute; inset:0; pointer-events:none; z-index:4; }
        .sg-pane-host .tp-dfwv{ pointer-events:auto; } /* allow clicking pane */
      `}</style>
    </section>
  );
}
