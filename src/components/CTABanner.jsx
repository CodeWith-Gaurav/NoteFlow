/* eslint-disable react/no-unknown-property */
import React, { forwardRef, useRef, useMemo, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color } from 'three';

// --- UTILITY FUNCTIONS ---
const hexToNormalizedRGB = color => {
    if (color.startsWith('#')) {
        color = color.replace('#', '');
        return [
            parseInt(color.slice(0, 2), 16) / 255,
            parseInt(color.slice(2, 4), 16) / 255,
            parseInt(color.slice(4, 6), 16) / 255
        ];
    } else if (color.startsWith('rgb')) {
        const [r, g, b] = color
            .replace(/[^\d,]/g, '')
            .split(',')
            .map(Number);
        return [r / 255, g / 255, b / 255];
    }
    return [1, 1, 1];
};

// --- SHADERS ---
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2 r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  vec2 tex = uv * uScale;
  float tOffset = uSpeed * uTime;
  tex.y += 0.1 * sin(4.0 * tex.x - tOffset * 2.0);
  tex.x += 0.05 * cos(3.0 * tex.y + tOffset * 1.5);
  float pattern = 0.5 + 0.5 * sin(5.0 * (tex.x + tex.y + tOffset * 0.2));
  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

// --- R3F PLANE ---
const SilkPlane = forwardRef(function SilkPlane({ uniforms }, ref) {
    const { viewport } = useThree();

    useLayoutEffect(() => {
        if (ref.current) {
            ref.current.scale.set(viewport.width, viewport.height, 1);
        }
    }, [ref, viewport]);

    useFrame((_, delta) => {
        if (ref.current && ref.current.material.uniforms.uTime) {
            ref.current.material.uniforms.uTime.value += 1.0 * delta;
        }
    });

    return (
        <mesh ref={ref}>
            <planeGeometry args={[1, 1, 1, 1]} />
            <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
        </mesh>
    );
});

// --- SILK CANVAS WRAPPER ---
const Silk = ({ speed = 5, scale = 1, color = '#7B7481', noiseIntensity = 1.5, rotation = 0 }) => {
    const meshRef = useRef();

    const uniforms = useMemo(
        () => ({
            uSpeed: { value: speed },
            uScale: { value: scale },
            uNoiseIntensity: { value: noiseIntensity },
            uColor: { value: new Color(...hexToNormalizedRGB(color)) },
            uRotation: { value: rotation },
            uTime: { value: 0 }
        }),
        [speed, scale, noiseIntensity, color, rotation]
    );

    return (
        <Canvas dpr={[1, 2]} frameloop="always" className="w-full h-full">
            <SilkPlane ref={meshRef} uniforms={uniforms} />
        </Canvas>
    );
};

// --- MAIN COMPONENT ---
const CTABanner = ({ theme }) => {
    const { isSignedIn } = useUser();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        if (!isSignedIn) {
            const signInButton = document.getElementById('cta-sign-in-trigger');
            if (signInButton) signInButton.click();
        } else {
            navigate('/generate');
        }
    };

    const variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
    };

    const textColor = 'text-white';
    const buttonClasses =
        'bg-primary text-white px-8 py-3 rounded-full cursor-pointer hover:scale-105 transition-all shadow-lg shadow-primary/50 text-sm font-medium';

    return (
        <motion.section
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="relative py-20 overflow-hidden min-h-[300px]"
        >
            {/* 1. Background */}
            <div className="absolute inset-0 z-0 min-h-[300px]">
                <Silk speed={2} scale={2.0} color="rgb(66, 123, 255)" noiseIntensity={1.0} rotation={0.5} />
            </div>

            {/* 2. Overlay */}
            <div className="absolute inset-0 bg-black/40 z-[5] pointer-events-none"></div>

            {/* 3. Content */}
            <div className={`relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-12 ${textColor}`}>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">
                    Transform your notes into Infographics now.
                </h2>

                <p className="text-lg font-medium opacity-90 mb-8 max-w-2xl mx-auto">
                    Stop writing notes and start creating knowledge. Ready to streamline your study process?
                </p>

                {/* ✅ Get Started Button */}
                <div onClick={handleGetStarted} className={`inline-flex items-center justify-center ${buttonClasses}`}>
                    Get Started Now
                </div>

                {/* Hidden Sign-In Trigger */}
                <div className="hidden">
                    <SignInButton mode="modal">
                        <button id="cta-sign-in-trigger"></button>
                    </SignInButton>
                </div>
            </div>
        </motion.section>
    );
};

export default CTABanner;
