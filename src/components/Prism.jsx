import { useEffect, useRef } from 'react';
import { Renderer, Triangle, Program, Mesh } from 'ogl';

// ⭐️ Global storage for OGL instance to avoid passing around or re-creating
const ogl = {
    renderer: null,
    gl: null,
    program: null,
    mesh: null,
    container: null,
    raf: 0,
    t0: performance.now(),
    rotBuf: new Float32Array(9),
    iResBuf: new Float32Array(2),
    offsetPxBuf: new Float32Array(2),
    pointer: { x: 0, y: 0, inside: true },
    wX: 0, wY: 0, wZ: 0, phX: 0, phZ: 0,
    yaw: 0, pitch: 0, roll: 0,
    targetYaw: 0, targetPitch: 0,
    dpr: 1,
    HOVSTR: 1,
    INERT: 0.12,
    NOISE_IS_ZERO: false,
    TS: 0,
    SCALE: 1,
    animationType: 'rotate',
    ro: null,
    io: null
};

// Utility function to set rotation matrix
const setMat3FromEuler = (yawY, pitchX, rollZ, out) => {
    // ... (Your original setMat3FromEuler implementation remains the same)
    const cy = Math.cos(yawY), sy = Math.sin(yawY);
    const cx = Math.cos(pitchX), sx = Math.sin(pitchX);
    const cz = Math.cos(rollZ), sz = Math.sin(rollZ);
    const r00 = cy * cz + sy * sx * sz;
    const r01 = -cy * sz + sy * sx * cz;
    const r02 = sy * cx;
    const r10 = cx * sz;
    const r11 = cx * cz;
    const r12 = -sx;
    const r20 = -sy * cz + cy * sx * sz;
    const r21 = sy * sz + cy * sx * cz;
    const r22 = cy * cx;
    out[0] = r00; out[1] = r10; out[2] = r20; out[3] = r01; out[4] = r11; out[5] = r21; out[6] = r02; out[7] = r12; out[8] = r22;
    return out;
};

const lerp = (a, b, t) => a + (b - a) * t;

// Define shader code outside the component
const vertex = /* glsl */ `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;
const fragment = /* glsl */ `
    precision highp float;

    uniform vec2  iResolution;
    uniform float iTime;

    uniform float uHeight;
    uniform float uBaseHalf;
    uniform mat3  uRot;
    uniform int   uUseBaseWobble;
    uniform float uGlow;
    uniform vec2  uOffsetPx;
    uniform float uNoise;
    uniform float uSaturation;
    uniform float uScale;
    uniform float uHueShift;
    uniform float uColorFreq;
    uniform float uBloom;
    uniform float uCenterShift;
    uniform float uInvBaseHalf;
    uniform float uInvHeight;
    uniform float uMinAxis;
    uniform float uPxScale;
    uniform float uTimeScale;

    vec4 tanh4(vec4 x){
      vec4 e2x = exp(2.0*x);
      return (e2x - 1.0) / (e2x + 1.0);
    }

    float rand(vec2 co){
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    float sdOctaAnisoInv(vec3 p){
      vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
      float m = q.x + q.y + q.z - 1.0;
      return m * uMinAxis * 0.5773502691896258;
    }

    float sdPyramidUpInv(vec3 p){
      float oct = sdOctaAnisoInv(p);
      float halfSpace = -p.y;
      return max(oct, halfSpace);
    }

    mat3 hueRotation(float a){
      float c = cos(a), s = sin(a);
      mat3 W = mat3(
        0.299, 0.587, 0.114,
        0.299, 0.587, 0.114,
        0.299, 0.587, 0.114
      );
      mat3 U = mat3(
         0.701, -0.587, -0.114,
        -0.299,  0.413, -0.114,
        -0.300, -0.588,  0.886
      );
      mat3 V = mat3(
         0.168, -0.331,  0.500,
         0.328,  0.035, -0.500,
        -0.497,  0.296,  0.201
      );
      return W + U * c + V * s;
    }

    void main(){
      vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;

      float z = 5.0;
      float d = 0.0;

      vec3 p;
      vec4 o = vec4(0.0);

      float centerShift = uCenterShift;
      float cf = uColorFreq;

      mat2 wob = mat2(1.0);
      if (uUseBaseWobble == 1) {
        float t = iTime * uTimeScale;
        float c0 = cos(t + 0.0);
        float c1 = cos(t + 33.0);
        float c2 = cos(t + 11.0);
        wob = mat2(c0, c1, c2, c0);
      }

      const int STEPS = 100;
      for (int i = 0; i < STEPS; i++) {
        p = vec3(f, z);
        p.xz = p.xz * wob;
        p = uRot * p;
        vec3 q = p;
        q.y += centerShift;
        d = 0.1 + 0.2 * abs(sdPyramidUpInv(q));
        z -= d;
        o += (sin((p.y + z) * cf + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
      }

      o = tanh4(o * o * (uGlow * uBloom) / 1e5);

      vec3 col = o.rgb;
      float n = rand(gl_FragCoord.xy + vec2(iTime));
      col += (n - 0.5) * uNoise;
      col = clamp(col, 0.0, 1.0);

      float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);

      if(abs(uHueShift) > 0.0001){
        col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
      }

      gl_FragColor = vec4(col, o.a);
    }
`;

const Prism = ({
  height = 3.5,
  baseWidth = 5.5,
  animationType = 'rotate',
  glow = 1,
  offset = { x: 0, y: 0 },
  noise = 0.5,
  transparent = true,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  hoverStrength = 2,
  inertia = 0.05,
  bloom = 1,
  suspendWhenOffscreen = false,
  timeScale = 0.5
}) => {
  const containerRef = useRef(null);

  // ⭐️ Refactored: Unified render loop
  const render = (t) => {
    const time = (t - ogl.t0) * 0.001;
    ogl.program.uniforms.iTime.value = time;

    let continueRAF = true;

    if (ogl.animationType === 'hover') {
        const maxPitch = 0.6 * ogl.HOVSTR;
        const maxYaw = 0.6 * ogl.HOVSTR;
        ogl.targetYaw = (ogl.pointer.inside ? -ogl.pointer.x : 0) * maxYaw;
        ogl.targetPitch = (ogl.pointer.inside ? ogl.pointer.y : 0) * maxPitch;
        ogl.yaw = lerp(ogl.yaw, ogl.targetYaw, ogl.INERT);
        ogl.pitch = lerp(ogl.pitch, ogl.targetPitch, ogl.INERT);
        ogl.roll = lerp(ogl.roll, 0, 0.1);
        ogl.program.uniforms.uRot.value = setMat3FromEuler(ogl.yaw, ogl.pitch, ogl.roll, ogl.rotBuf);

        if (ogl.NOISE_IS_ZERO && !ogl.pointer.inside) {
            const settled =
                Math.abs(ogl.yaw - ogl.targetYaw) < 1e-4 && Math.abs(ogl.pitch - ogl.targetPitch) < 1e-4 && Math.abs(ogl.roll) < 1e-4;
            if (settled) continueRAF = false;
        }
    } else if (ogl.animationType === '3drotate') {
        const tScaled = time * ogl.TS;
        ogl.yaw = tScaled * ogl.wY;
        ogl.pitch = Math.sin(tScaled * ogl.wX + ogl.phX) * 0.6;
        ogl.roll = Math.sin(tScaled * ogl.wZ + ogl.phZ) * 0.5;
        ogl.program.uniforms.uRot.value = setMat3FromEuler(ogl.yaw, ogl.pitch, ogl.roll, ogl.rotBuf);
        if (ogl.TS < 1e-6) continueRAF = false;
    } else {
        // 'rotate' (base wobble) or no animation
        if (ogl.TS < 1e-6) continueRAF = false;
    }

    if (ogl.renderer && ogl.mesh) ogl.renderer.render({ scene: ogl.mesh });

    if (continueRAF && (ogl.animationType !== 'hover' || ogl.pointer.inside || !ogl.NOISE_IS_ZERO)) {
        ogl.raf = requestAnimationFrame(render);
    } else {
        ogl.raf = 0;
    }
  };

  const startRAF = () => {
    if (ogl.raf) return;
    ogl.raf = requestAnimationFrame(render);
  };
  const stopRAF = () => {
    if (!ogl.raf) return;
    cancelAnimationFrame(ogl.raf);
    ogl.raf = 0;
  };


  // 1. ⭐️ INITIALIZATION EFFECT (Runs only once on mount, or if structural props change)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Cleanup function for unmount ---
    return () => {
        stopRAF();
        if (ogl.ro) ogl.ro.disconnect();
        if (ogl.io && ogl.container.__prismIO) ogl.io.disconnect();
        if (ogl.animationType === 'hover') {
            window.removeEventListener('pointermove', ogl.onPointerMove);
            window.removeEventListener('mouseleave', ogl.onLeave);
            window.removeEventListener('blur', ogl.onBlur);
        }
        if (ogl.gl && ogl.gl.canvas.parentElement === container) container.removeChild(ogl.gl.canvas);
        ogl.renderer = null; ogl.gl = null; ogl.program = null; ogl.mesh = null; ogl.container = null;
    };
  }, []); 

  // 2. ⭐️ STRUCTURAL/ANIMATION SETUP EFFECT (Runs on mount, or if structural props change)
  // We only run this on props that affect the actual GL context or loop logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container || ogl.gl) return; // Only initialize if GL context doesn't exist

    // Constants setup
    const H = Math.max(0.001, height);
    const BW = Math.max(0.001, baseWidth);
    const BASE_HALF = BW * 0.5;
    const rnd = () => Math.random();
    const RSX = 1; const RSY = 1; const RSZ = 1;

    ogl.dpr = Math.min(2, window.devicePixelRatio || 1);
    ogl.renderer = new Renderer({
      dpr: ogl.dpr,
      alpha: transparent,
      antialias: false
    });
    ogl.gl = ogl.renderer.gl;
    ogl.gl.disable(ogl.gl.DEPTH_TEST);
    ogl.gl.disable(ogl.gl.CULL_FACE);
    ogl.gl.disable(ogl.gl.BLEND);
    ogl.container = container;
    ogl.NOISE_IS_ZERO = noise < 1e-6;
    
    // Initial random values for 3drotate
    ogl.wX = (0.3 + rnd() * 0.6) * RSX;
    ogl.wY = (0.2 + rnd() * 0.7) * RSY;
    ogl.wZ = (0.1 + rnd() * 0.5) * RSZ;
    ogl.phX = rnd() * Math.PI * 2;
    ogl.phZ = rnd() * Math.PI * 2;
    
    // Canvas styling
    Object.assign(ogl.gl.canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      display: 'block'
    });
    container.appendChild(ogl.gl.canvas);

    const geometry = new Triangle(ogl.gl);
    
    // Create uniforms object with structural defaults
    const uniforms = {
        iResolution: { value: ogl.iResBuf },
        iTime: { value: 0 },
        uHeight: { value: H },
        uBaseHalf: { value: BASE_HALF },
        uUseBaseWobble: { value: animationType === 'rotate' ? 1 : 0 },
        uRot: { value: ogl.rotBuf },
        uGlow: { value: glow },
        uOffsetPx: { value: ogl.offsetPxBuf },
        uNoise: { value: noise },
        uSaturation: { value: transparent ? 1.5 : 1 },
        uScale: { value: scale },
        uHueShift: { value: hueShift },
        uColorFreq: { value: colorFrequency },
        uBloom: { value: bloom },
        uCenterShift: { value: H * 0.25 },
        uInvBaseHalf: { value: 1 / BASE_HALF },
        uInvHeight: { value: 1 / H },
        uMinAxis: { value: Math.min(BASE_HALF, H) },
        uPxScale: {
            value: 1 / ((ogl.gl.drawingBufferHeight || 1) * 0.1 * scale)
        },
        uTimeScale: { value: timeScale }
    };

    ogl.program = new Program(ogl.gl, { vertex, fragment, uniforms });
    ogl.mesh = new Mesh(ogl.gl, { geometry, program: ogl.program });

    // Resize logic
    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      ogl.renderer.setSize(w, h);
      ogl.iResBuf[0] = ogl.gl.drawingBufferWidth;
      ogl.iResBuf[1] = ogl.gl.drawingBufferHeight;
      ogl.offsetPxBuf[0] = (offset?.x ?? 0) * ogl.dpr;
      ogl.offsetPxBuf[1] = (offset?.y ?? 0) * ogl.dpr;
      ogl.program.uniforms.uPxScale.value = 1 / ((ogl.gl.drawingBufferHeight || 1) * 0.1 * ogl.SCALE);
    };

    ogl.ro = new ResizeObserver(resize);
    ogl.ro.observe(container);
    resize();

    // Event listeners setup for 'hover' mode
    ogl.onMove = e => {
      const ww = Math.max(1, window.innerWidth);
      const wh = Math.max(1, window.innerHeight);
      const cx = ww * 0.5;
      const cy = wh * 0.5;
      const nx = (e.clientX - cx) / (ww * 0.5);
      const ny = (e.clientY - cy) / (wh * 0.5);
      ogl.pointer.x = Math.max(-1, Math.min(1, nx));
      ogl.pointer.y = Math.max(-1, Math.min(1, ny));
      ogl.pointer.inside = true;
      startRAF();
    };
    ogl.onLeave = () => { ogl.pointer.inside = false; };
    ogl.onBlur = () => { ogl.pointer.inside = false; };

    // Set initial animation properties for the render loop
    ogl.animationType = animationType;
    ogl.HOVSTR = hoverStrength;
    ogl.INERT = inertia;
    ogl.TS = timeScale;
    ogl.SCALE = scale;
    
    if (animationType === 'hover') {
      window.addEventListener('pointermove', ogl.onMove, { passive: true });
      window.addEventListener('mouseleave', ogl.onLeave);
      window.addEventListener('blur', ogl.onBlur);
    }
    
    // Intersection Observer for suspendWhenOffscreen
    if (suspendWhenOffscreen) {
        ogl.io = new IntersectionObserver(entries => {
            const vis = entries.some(e => e.isIntersecting);
            if (vis) startRAF();
            else stopRAF();
        }, { threshold: 0.1 });
        ogl.io.observe(container);
        container.__prismIO = ogl.io;
    }
    
    startRAF();

  }, [
    // Structural/Setup Dependencies: Only include props that change the GL program/geometry/listeners
    height, baseWidth, transparent, animationType, suspendWhenOffscreen
  ]);


  // 3. ⭐️ UNIFORM UPDATE EFFECT (Runs when dynamic props change, preventing GL context reset)
  useEffect(() => {
    if (!ogl.program) return; // Wait for initialization

    // Update dynamic uniforms
    ogl.program.uniforms.uGlow.value = glow;
    ogl.program.uniforms.uNoise.value = noise;
    ogl.program.uniforms.uHueShift.value = hueShift;
    ogl.program.uniforms.uColorFreq.value = colorFrequency;
    ogl.program.uniforms.uBloom.value = bloom;
    
    // Update global state for render loop logic
    ogl.HOVSTR = hoverStrength;
    ogl.INERT = inertia;
    ogl.TS = timeScale;
    ogl.NOISE_IS_ZERO = noise < 1e-6;

    // Restart RAF if it was settled in hover mode and a prop changed
    if (ogl.animationType === 'hover' && ogl.raf === 0 && !ogl.NOISE_IS_ZERO) {
        startRAF();
    }
    
  }, [
    glow, noise, hueShift, colorFrequency, bloom, hoverStrength, inertia, timeScale
  ]);

  return <div className="w-full h-full relative" ref={containerRef} />;
};

export default Prism;