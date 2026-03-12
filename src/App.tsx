import React, { useState, useEffect, useRef } from 'react';
import { DirectorMode } from './components/DirectorMode/DirectorMode';
import { 
  LayoutDashboard, 
  Cpu, 
  Activity, 
  Terminal, 
  Box, 
  Zap, 
  ChevronRight, 
  Plus, 
  Search,
  Bell,
  Settings,
  Play,
  CheckCircle2,
  Clock,
  Code2,
  Sparkles,
  MessageSquare,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// --- Types ---
interface Job {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'queued';
  progress: number;
  accuracy: number;
}

interface Architecture {
  architectureName: string;
  modelChoice: string;
  trainingStrategy: string;
  deploymentConfig: string;
  suggestedCode: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// --- Mock Data ---
const PERFORMANCE_DATA = [
  { time: '00:00', loss: 0.8, val_loss: 0.9 },
  { time: '04:00', loss: 0.6, val_loss: 0.75 },
  { time: '08:00', loss: 0.45, val_loss: 0.55 },
  { time: '12:00', loss: 0.3, val_loss: 0.42 },
  { time: '16:00', loss: 0.22, val_loss: 0.35 },
  { time: '20:00', loss: 0.15, val_loss: 0.28 },
  { time: '24:00', loss: 0.1, val_loss: 0.25 },
];

// --- Components ---

const StatCard = ({ label, value, trend, icon: Icon }: any) => (
  <div className="glass p-4 rounded-xl flex flex-col gap-1">
    <div className="flex justify-between items-start">
      <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">{label}</span>
      <Icon className="w-4 h-4 text-brand-accent" />
    </div>
    <div className="flex items-baseline gap-2 mt-2">
      <span className="text-2xl font-semibold text-zinc-100">{value}</span>
      <span className="text-[10px] text-emerald-500 font-medium">{trend}</span>
    </div>
  </div>
);

const PipelineNode = ({ label, status, icon: Icon }: any) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
      status === 'active' ? 'border-brand-accent bg-brand-accent/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-brand-border bg-brand-surface'
    }`}>
      <Icon className={`w-5 h-5 ${status === 'active' ? 'text-brand-accent' : 'text-zinc-500'}`} />
    </div>
    <span className="text-[10px] font-mono uppercase text-zinc-500">{label}</span>
  </div>
);

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [architectInput, setArchitectInput] = useState('');
  const [suggestedArch, setSuggestedArch] = useState<Architecture | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi! I am your Gradient AI Consultant. Ask me anything about scaling your ML pipelines or DigitalOcean architecture!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [directorMode, setDirectorMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatting]);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      });
  }, []);

  const handleGenerate = async () => {
    if (!architectInput) return;
    setIsGenerating(true);
    try {
      const req = await fetch('/api/architect', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: architectInput })
      });
      const result = await req.json();
      setSuggestedArch(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    
    const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
    setChatMessages(newMessages as any);
    setChatInput('');
    setIsChatting(true);
    
    try {
      const req = await fetch('/api/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await req.json();
      const reply = data.choices[0].message.content;
      
      setChatMessages([...newMessages, { role: 'assistant', content: reply }] as any);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col data-grid">
      {/* Navigation */}
      <nav className="h-16 border-b border-brand-border glass flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-accent rounded flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-zinc-100">GRADIENT<span className="text-brand-accent">FLOW</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#" className="text-zinc-100 border-b-2 border-brand-accent py-5">Dashboard</a>
          <a href="#" className="hover:text-zinc-100 transition-colors">Models</a>
          <a href="#" className="hover:text-zinc-100 transition-colors">Deployments</a>
          <a href="#" className="hover:text-zinc-100 transition-colors">Infrastructure</a>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search clusters..." 
              className="bg-brand-surface border border-brand-border rounded-full pl-10 pr-4 py-1.5 text-xs focus:outline-none focus:border-brand-accent transition-all w-48"
            />
          </div>
          <button className="p-2 hover:bg-brand-surface rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-accent rounded-full border-2 border-brand-bg"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent to-indigo-600 border border-white/20"></div>
        </div>
      </nav>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-12 gap-6">
        {/* Header Section */}
        <div className="col-span-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold">Mission Control</h1>
            <p className="text-zinc-500 text-sm">Orchestrating 12 active clusters across Gradient™ AI</p>
          </div>
          <div className="flex gap-3">
            <button className="glass px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-brand-surface transition-all">
              <Terminal className="w-4 h-4" />
              CLI Access
            </button>
            <button onClick={() => setDirectorMode(true)} className="bg-brand-accent text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-brand-accent/20">
              <Play className="w-4 h-4 fill-current" />
              Director Demo
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="Active GPUs" value="48/64" trend="+12%" icon={Cpu} />
          <StatCard label="Avg. Latency" value="14.2ms" trend="-4.1%" icon={Zap} />
          <StatCard label="Total Compute" value="1.2 PFLOPS" trend="+0.8%" icon={Activity} />
          
          {/* Main Chart */}
          <div className="col-span-1 sm:col-span-3 glass p-6 rounded-2xl h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-500">Training Loss Convergence</h3>
              <div className="flex gap-4 text-[10px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
                  <span>TRAIN_LOSS</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  <span>VAL_LOSS</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERFORMANCE_DATA}>
                <defs>
                  <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis dataKey="time" stroke="#52525B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525B" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141417', border: '1px solid #27272A', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#E4E4E7' }}
                />
                <Area type="monotone" dataKey="loss" stroke="#3B82F6" fillOpacity={1} fill="url(#colorLoss)" strokeWidth={2} />
                <Area type="monotone" dataKey="val_loss" stroke="#818CF8" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Active Jobs */}
          <div className="col-span-1 sm:col-span-3 glass rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-border flex justify-between items-center">
              <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-500">Active Training Jobs</h3>
              <button className="text-[10px] text-brand-accent hover:underline">View All</button>
            </div>
            <div className="divide-y divide-brand-border">
              {jobs.map((job) => (
                <div key={job.id} className="px-6 py-4 flex items-center justify-between hover:bg-brand-surface/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      job.status === 'running' ? 'bg-brand-accent animate-pulse' : 
                      job.status === 'completed' ? 'bg-emerald-500' : 'bg-zinc-600'
                    }`}></div>
                    <div>
                      <div className="text-sm font-medium text-zinc-100">{job.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{job.id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="hidden sm:block">
                      <div className="text-[10px] text-zinc-500 uppercase mb-1">Accuracy</div>
                      <div className="text-xs font-mono text-zinc-100">{(job.accuracy * 100).toFixed(1)}%</div>
                    </div>
                    <div className="w-32">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span>{job.status}</span>
                        <span>{job.progress}%</span>
                      </div>
                      <div className="h-1 bg-brand-border rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${job.progress}%` }}
                          className="h-full bg-brand-accent"
                        />
                      </div>
                    </div>
                    <button className="p-1.5 hover:bg-brand-surface rounded transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: AI Architect */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="glass p-6 rounded-2xl flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-brand-accent" />
              <h3 className="font-bold text-zinc-100">AI Architect</h3>
            </div>
            <p className="text-xs text-zinc-500 mb-6">Describe your problem and I'll design the optimal Gradient™ AI pipeline.</p>
            
            <div className="flex-1 flex flex-col gap-4">
              <textarea 
                id="architect-input"
                value={architectInput}
                onChange={(e) => setArchitectInput(e.target.value)}
                placeholder="e.g., I need to train a real-time object detection model for autonomous drones..."
                className="flex-1 bg-brand-bg border border-brand-border rounded-xl p-4 text-sm focus:outline-none focus:border-brand-accent resize-none placeholder:text-zinc-700"
              />
              <button 
                id="btn-generate"
                onClick={handleGenerate}
                disabled={isGenerating || !architectInput}
                className="w-full bg-zinc-100 text-brand-bg py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <div id="architect-loader" className="w-4 h-4 border-2 border-brand-bg border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    Generate Architecture
                  </>
                )}
              </button>
            </div>

            <AnimatePresence>
              {suggestedArch && (
                <motion.div 
                  id="architect-result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-brand-accent/5 border border-brand-accent/20 rounded-xl"
                >
                  <h4 className="text-sm font-bold text-brand-accent mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {suggestedArch.architectureName}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-600 uppercase block">Model Choice</span>
                      <span className="text-xs text-zinc-300">{suggestedArch.modelChoice}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-600 uppercase block">Strategy</span>
                      <span className="text-xs text-zinc-300">{suggestedArch.trainingStrategy}</span>
                    </div>
                    <div className="mt-4 p-3 bg-[#0a0a0c] border border-brand-border rounded-lg max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-brand-accent/20">
                      <pre className="text-[10px] font-mono text-zinc-400 whitespace-pre-wrap">
                        {suggestedArch.suggestedCode}
                      </pre>
                    </div>
                    <button 
                      id="btn-copy-code"
                      onClick={() => {
                        navigator.clipboard.writeText(suggestedArch.suggestedCode);
                        alert('Code copied to clipboard!');
                      }}
                      className="w-full mt-2 py-2 border border-brand-border rounded-lg text-[10px] font-mono flex items-center justify-center gap-2 hover:bg-brand-surface transition-colors"
                    >
                      <Code2 className="w-3 h-3" />
                      COPY GENERATED CODE
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pipeline Visualization */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-500 mb-8">Active Pipeline</h3>
            <div className="flex items-center justify-between relative px-2">
              {/* Connector Line */}
              <div className="absolute top-6 left-8 right-8 h-0.5 bg-brand-border z-0">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '66%' }}
                  className="h-full bg-brand-accent"
                />
              </div>
              
              <PipelineNode label="Ingest" status="completed" icon={Box} />
              <PipelineNode label="Process" status="completed" icon={Zap} />
              <PipelineNode label="Train" status="active" icon={Activity} />
              <PipelineNode label="Deploy" status="queued" icon={Play} />
            </div>
          </div>

          {/* Consultant Chat */}
          <div className="glass p-6 rounded-2xl flex flex-col h-[400px]">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-brand-border">
               <MessageSquare className="w-5 h-5 text-brand-accent" />
               <h3 className="font-bold text-zinc-100">Gradient Consultant</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-brand-accent/20">
               {chatMessages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                     msg.role === 'user' 
                       ? 'bg-brand-accent text-white rounded-tr-sm' 
                       : 'bg-brand-surface border border-brand-border text-zinc-300 rounded-tl-sm'
                   }`}>
                     {msg.content}
                   </div>
                 </div>
               ))}
               {isChatting && (
                 <div id="chat-loader" className="flex justify-start">
                   <div className="bg-brand-surface border border-brand-border p-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                     <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-100"></span>
                     <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-200"></span>
                   </div>
                 </div>
               )}
               <div ref={chatEndRef} />
            </div>

            <div className="flex gap-2">
              <input 
                id="chat-input"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Ask about deployment strategies..."
                className="flex-1 bg-brand-bg border border-brand-border rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-brand-accent transition-colors"
              />
              <button 
                id="btn-send-chat"
                onClick={handleChat}
                disabled={isChatting || !chatInput.trim()}
                className="bg-brand-accent text-white p-2.5 rounded-xl hover:bg-brand-accent/80 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-brand-border glass flex items-center justify-between px-6 text-[10px] font-mono text-zinc-600">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            SYSTEM_ONLINE
          </span>
          <span>REGION: NYC-3</span>
          <span>API_V: 2.4.0-STABLE</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-zinc-400">DOCUMENTATION</a>
          <a href="#" className="hover:text-zinc-400">SUPPORT</a>
          <a href="#" className="hover:text-zinc-400">STATUS</a>
        </div>
      </footer>
      {directorMode && <DirectorMode onClose={() => setDirectorMode(false)} />}
    </div>
  );
}
