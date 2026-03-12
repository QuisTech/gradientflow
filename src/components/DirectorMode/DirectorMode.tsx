import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PluginConsole, PluginConsoleRef } from './PluginConsole';

type ScriptStep =
  | { type: 'cursor'; targetId?: string; x?: number | string; y?: number | string; delay?: number }
  | { type: 'click'; targetId?: string; delay?: number }
  | { type: 'subtitle'; text: string; delay?: number }
  | { type: 'log'; text: string; delay?: number }
  | { type: 'event'; eventType: string; message: string; delay?: number }
  | { type: 'scroll'; targetId?: string; y: number; delay?: number }
  | { type: 'type'; targetId: string; text: string; delay?: number }
  | { type: 'waitForLoader'; targetId: string; delay?: number }
  | { type: 'wait'; delay: number };

const SCRIPT: ScriptStep[] = [
    // --- 0:00 - INTRODUCTION (15s) ---
    { type: 'cursor', x: '50%', y: '50%', delay: 2000 },
    { type: 'subtitle', text: 'Welcome to GradientFlow Architect. A DigitalOcean AI Mission Control.', delay: 4000 },
    { type: 'log', text: '[System] Booting GradientFlow Daemon v2.1.0' },
    { type: 'wait', delay: 1500 },
    { type: 'log', text: '[Auth] DigitalOcean App Platform Tokens Verified' },
    { type: 'subtitle', text: 'We translate plain English into production Machine Learning architectures natively using DigitalOcean Agents.', delay: 5000 },
   
    // --- 0:15 - AI ARCHITECT PROMPTING (20s) ---
    { type: 'subtitle', text: 'Step 1. The AI Architect Generator.', delay: 3500 },
    { type: 'cursor', targetId: 'architect-input', delay: 1500 },
    { type: 'click', targetId: 'architect-input', delay: 1000 },
    { type: 'type', targetId: 'architect-input', text: 'I need a real-time object detection model for autonomous drones running complex vision algorithms on edge GPUs.\n\nPlease specify constraints regarding quantization and transferring learning.', delay: 2000 },
    { type: 'log', text: '[Input] Prompting Architect...' },
    { type: 'event', eventType: 'DataInjection', message: 'Simulating Prompt Input...', delay: 1500 },
    { type: 'subtitle', text: 'Scenario: We are designing an edge-AI model for autonomous drones running complex vision algorithms.', delay: 5000 },
    
    { type: 'wait', delay: 1000 },
    { type: 'cursor', targetId: 'btn-generate', delay: 1500 },
    { type: 'wait', delay: 800 },
    { type: 'click', targetId: 'btn-generate', delay: 500 },
    { type: 'log', text: '[API] POST /api/architect -> DO Agent' },
    { type: 'subtitle', text: 'The Llama 3.1 8B Instruct model parses the constraints in real-time securely through our proxy backend.', delay: 4500 },
   
    // Wait for generation to finish dynamically
    { type: 'subtitle', text: 'Generating formal JSON schema... (this may take a few seconds)', delay: 1500 },
    { type: 'waitForLoader', targetId: 'architect-loader' },
    { type: 'wait', delay: 1000 },
    { type: 'log', text: '[System] Architecture Payload Received (Schema: Valid JSON)' },
    { type: 'subtitle', text: 'Optimal Architecture Generated! Includes Model parameters, Edge constraints, and training code.', delay: 5000 },

    // --- 0:50 - EXPLORING RESULTS (20s) ---
    { type: 'scroll', y: 350, targetId: 'window', delay: 2000 },
    { type: 'subtitle', text: 'The frontend flawlessly unpacks the Neural Network JSON into beautifully rendered code blocks.', delay: 5000 },
    { type: 'scroll', y: 450, targetId: 'window', delay: 2000 },
    { type: 'wait', delay: 2000 },
    { type: 'scroll', y: 550, targetId: 'window', delay: 2000 },
    { type: 'wait', delay: 2000 },

    { type: 'cursor', targetId: 'btn-copy-code', delay: 1500 },
    { type: 'click', targetId: 'btn-copy-code', delay: 1000 },
    { type: 'log', text: '[System] Code securely copied to clipboard' },

    // --- 1:10 - CONSULTANT CHAT & RAG (35s) ---
    { type: 'subtitle', text: 'Step 2: DigitalOcean Consultant RAG Knowledge Base', delay: 4000 },
    { type: 'scroll', y: 0, targetId: 'window', delay: 1500 },
    { type: 'subtitle', text: 'We linked the Agent to an OpenSearch Knowledge Database holding Drone Vision Research PDFs.', delay: 5000 },

    { type: 'cursor', targetId: 'chat-input', delay: 1500 },
    { type: 'click', targetId: 'chat-input', delay: 1000 },
    { type: 'subtitle', text: 'Let`s query the Agent about specific algorithms mentioned in the uploaded scientific paper.', delay: 2000 },
    { type: 'type', targetId: 'chat-input', text: 'What does our uploaded Drone Vision Research PDF recommend for real-time edge processing? Summarize the main points.', delay: 2000 },
    
    { type: 'log', text: '[Input] Asking Contextual Edge-UAV question' },
    { type: 'event', eventType: 'DataInjection', message: 'Simulating Chat...', delay: 1500 },

    { type: 'cursor', targetId: 'btn-send-chat', delay: 1500 },
    { type: 'click', targetId: 'btn-send-chat', delay: 1000 },
    { type: 'log', text: '[API] POST /api/chat -> DO RAG Retrieval' },
    { type: 'subtitle', text: 'The DigitalOcean Agent instantly searches the vector space for matching research paragraphs...', delay: 5000 },
    
    // Chat typically responds in ~5-6 seconds, we wait dynamically
    { type: 'waitForLoader', targetId: 'chat-loader' },
    { type: 'wait', delay: 1000 },
    { type: 'log', text: '[System] Context Matches Found (Vectors: 0.89)' },
    
    { type: 'subtitle', text: 'Incredible. It hallucinates nothing. It directly extracted Vision Transformers, Operators, and Edge constraints from the pure PDF!', delay: 6000 },
    { type: 'wait', delay: 3000 },

    // --- 1:55 - OUTRO (15s) ---
    { type: 'subtitle', text: 'Deployable on App Platform. Accessible anywhere.', delay: 3000 },
    { type: 'subtitle', text: 'GradientFlow & DigitalOcean: From Prompt to Production. Over and out.', delay: 4000 },
    { type: 'event', eventType: 'Pipeline', message: 'Mission Complete' },
    { type: 'cursor', x: '95%', y: '95%', delay: 1500 },
    { type: 'wait', delay: 2000 }
];

export function DirectorMode({ onClose }: { onClose: () => void }) {
    const [subtitle, setSubtitle] = useState('');
    const [cursorPos, setCursorPos] = useState({ x: 100, y: 100 });
    const [isClicking, setIsClicking] = useState(false);
   
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const webcamRef = useRef<HTMLVideoElement>(null);
    const consoleRef = useRef<PluginConsoleRef>(null);

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    const startRecordingFlow = async () => {
        try {
            // Webcam
            try {
                const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                if (webcamRef.current) webcamRef.current.srcObject = camStream;
            } catch (e) {
                console.warn("No camera found", e);
            }

            // Screen Share
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: { displaySurface: "browser" },
                    audio: false
                });
                
                const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunksRef.current.push(e.data);
                };
                recorder.onstop = () => {
                    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `gradientflow-demo-${Date.now()}.webm`;
                    a.click();
                };
                mediaRecorderRef.current = recorder;
                recorder.start();
            } catch (e) {
                console.warn("Screen record denied. Continuing anyway.", e);
            }
           
            // Countdown
            for (let i = 5; i > 0; i--) {
                setSubtitle(`Initializing Director Mode in ${i}...`);
                await new Promise(r => setTimeout(r, 1000));
            }
            setSubtitle("");
           
            runScript();
           
        } catch (err) {
            console.error("Recording failed:", err);
            onClose();
        }
    };
   
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const runScript = async () => {
        for (const step of SCRIPT) {
            if (step.type === 'subtitle') {
                setSubtitle(step.text);
                speak(step.text.replace(/^(Scenario|Action|Effect|Step \\d): /, ''));
            }
            else if (step.type === 'log') {
                consoleRef.current?.log(step.text, 'info');
            }
           
            let nextPos = null;
           
            if ('targetId' in step && step.targetId) {
                const el = document.getElementById(step.targetId);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    nextPos = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2
                    };
                }
            }
            else if (step.type === 'cursor' && step.x !== undefined && step.y !== undefined) {
                nextPos = {
                    x: typeof step.x === 'string' ? (parseFloat(step.x) / 100) * window.innerWidth : step.x,
                    y: typeof step.y === 'string' ? (parseFloat(step.y) / 100) * window.innerHeight : step.y
                };
            }

            if (nextPos) setCursorPos(nextPos);

            if (step.type === 'click') {
                setIsClicking(true);
                await new Promise(r => setTimeout(r, 200));
               
                if (step.targetId) {
                    const el = document.getElementById(step.targetId);
                    if (el) el.click();
                } else {
                    const elem = document.elementFromPoint(cursorPos.x, cursorPos.y);
                    if (elem && elem instanceof HTMLElement) {
                        elem.click();
                        const btn = elem.closest('button') || elem.closest('input');
                        if (btn && btn !== elem) btn.click();
                    }
                }
               
                await new Promise(r => setTimeout(r, 200));
                setIsClicking(false);
            }
           
            if (step.type === 'scroll') {
                if (step.targetId === 'window') {
                    window.scrollTo({ top: step.y, behavior: 'smooth' });
                } else if (step.targetId) {
                    const el = document.getElementById(step.targetId);
                    if (el) el.scrollTo({ top: step.y, behavior: 'smooth' });
                }
            }
            else if (step.type === 'type' && 'targetId' in step && step.targetId) {
                const el = document.getElementById(step.targetId);
                if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                        el instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype, 
                        'value'
                    )?.set;
                    for (let i = 0; i <= (step as any).text.length; i++) {
                        nativeInputValueSetter?.call(el, (step as any).text.substring(0, i));
                        el.dispatchEvent(new Event('input', { bubbles: true }));
                        await new Promise(r => setTimeout(r, 40));
                    }
                }
            }
            else if (step.type === 'waitForLoader' && 'targetId' in step && step.targetId) {
                for (let i = 0; i < 60; i++) {
                    await new Promise(r => setTimeout(r, 500));
                    if (!document.getElementById(step.targetId)) break;
                }
            }
            else if (step.type === 'event') {
                 consoleRef.current?.log(`[Event] ${step.eventType}`, 'success');
            }
           
            if (step.delay) await new Promise(r => setTimeout(r, step.delay));
        }
       
        stopRecording();
        setSubtitle("Saving Artifact...");
        setTimeout(onClose, 3000);
    };

    const hasStartedRef = useRef(false);
    useEffect(() => {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;
        startRecordingFlow();
    }, []);

    return (
        <div className="director-overlay">
            <motion.div
                className="virtual-mouse"
                animate={{ x: cursorPos.x, y: cursorPos.y }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            >
                <div className={`cursor-pointer ${isClicking ? 'cursor-clicking' : ''}`}></div>
            </motion.div>

            <AnimatePresence>
                {subtitle && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="demo-subtitle"
                    >
                        {subtitle}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="webcam-overlay">
                <video ref={webcamRef} autoPlay muted playsInline className="webcam-video" />
            </div>

            <PluginConsole ref={consoleRef} />

            <button className="stop-btn" onClick={() => { stopRecording(); onClose(); }}>
                <div style={{width: 10, height: 10, background: 'red', borderRadius: '50%'}}></div>
            </button>
        </div>
    );
}
