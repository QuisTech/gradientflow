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
  | { type: 'wait'; delay: number };

const SCRIPT: ScriptStep[] = [
    // --- INTRODUCTION ---
    { type: 'cursor', x: '50%', y: '50%', delay: 1000 },
    { type: 'subtitle', text: 'Scenario: Designing Edge-AI Computer Vision', delay: 3000 },
    { type: 'log', text: '[System] GradientFlow Mission Control initialized' },
   
    // --- AI ARCHITECT ---
    { type: 'subtitle', text: 'Step 1: AI-Powered Architecture Generation', delay: 1000 },
    { type: 'cursor', targetId: 'architect-input', delay: 1500 },
    { type: 'wait', delay: 800 },
    { type: 'click', targetId: 'architect-input', delay: 500 },
    { type: 'log', text: '[Input] "I need a real-time object detection model for drones..."' },
    
    { type: 'wait', delay: 500 },
    { type: 'cursor', targetId: 'btn-generate', delay: 1500 },
    { type: 'wait', delay: 800 },
    { type: 'click', targetId: 'btn-generate', delay: 500 },
    { type: 'log', text: '[API] POST /api/architect' },
    { type: 'subtitle', text: 'The DO Agent Llama 3.1 model parses constraints in real-time.', delay: 2000 },
   
    // Wait for generation
    { type: 'wait', delay: 4000 },
    { type: 'log', text: '[System] Architecture Payload Received (Schema: Valid)' },
    { type: 'subtitle', text: 'Optimal Architecture: EfficientDet with Transfer Learning', delay: 3000 },

    // --- COPY CODE ---
    { type: 'scroll', y: 300, targetId: 'window', delay: 1000 },
    { type: 'cursor', targetId: 'btn-copy-code', delay: 1500 },
    { type: 'wait', delay: 800 },
    { type: 'click', targetId: 'btn-copy-code', delay: 500 },
    { type: 'log', text: '[System] Code securely copied to clipboard' },

    // --- CONSULTANT CHAT ---
    { type: 'subtitle', text: 'Step 3: Consultant RAG Verification', delay: 1000 },
    { type: 'cursor', targetId: 'chat-input', delay: 1500 },
    { type: 'click', targetId: 'chat-input', delay: 500 },
    { type: 'log', text: '[Input] Querying RAG Knowledge Base...' },
    
    { type: 'cursor', targetId: 'btn-send-chat', delay: 1500 },
    { type: 'click', targetId: 'btn-send-chat', delay: 500 },
    { type: 'subtitle', text: 'The Agent verifies constraints against uploaded PDF Research.', delay: 3000 },
    { type: 'log', text: '[API] POST /api/chat' },
    { type: 'wait', delay: 3000 },

    // --- OUTRO ---
    { type: 'subtitle', text: 'GradientFlow & DigitalOcean: From Prompt to Production.', delay: 3000 },
    { type: 'event', eventType: 'Pipeline', message: 'Demo Completed Successfully' },
    { type: 'cursor', x: '95%', y: '95%', delay: 1000 },
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
