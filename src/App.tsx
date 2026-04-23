import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import GlitchOverlay from './components/GlitchOverlay';
import { Terminal, Database, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-high-score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isPaused, setIsPaused] = useState(false);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('snake-high-score', newScore.toString());
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan font-sans selection:bg-magenta selection:text-black">
      <GlitchOverlay />
      
      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen gap-8">
        {/* System Header */}
        <header className="w-full max-w-5xl flex flex-col md:flex-row items-end justify-between border-b-4 border-magenta pb-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-magenta animate-pulse text-xs font-mono uppercase tracking-[0.3em]">
              <Terminal size={14} />
              SYSTEM_BOOT_SEQUENCE: SUCCESS
            </div>
            <h1 className="text-4xl md:text-6xl font-mono glitch-text text-white italic tracking-tighter">
              FRAGMENTED_<span className="text-magenta">REALITY</span>
            </h1>
          </div>
          <div className="text-right font-mono text-[10px] space-y-1 opacity-60">
            <p>_KERNEL_VER: 0.9.4.GLITCH</p>
            <p>_UPTIME: {Math.floor(Date.now() / 1000000)}ms</p>
            <p>_STATUS: COMPROMISED_LINK_ERR</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl">
          
          {/* Left Column: Memory Banks */}
          <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
             <div className="border-2 border-magenta p-4 bg-magenta/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-1 bg-magenta text-black text-[8px] font-mono">0x4F</div>
                <div className="flex items-center gap-2 text-magenta mb-4 font-mono text-sm">
                    <Database size={16} />
                    <span>MEMORY_BANKS</span>
                </div>
                <div className="space-y-4">
                    <div className="border-l-2 border-cyan pl-2">
                        <p className="text-[10px] text-magenta/50 uppercase font-mono">_CURRENT_BITS</p>
                        <p className="text-4xl font-bold font-mono text-cyan glitch-text">{score.toString().padStart(4, '0')}</p>
                    </div>
                    <div className="border-l-2 border-white/20 pl-2">
                        <p className="text-[10px] text-white/30 uppercase font-mono">_MAX_CAPACITY</p>
                        <p className="text-2xl font-bold font-mono text-white/40">{highScore.toString().padStart(4, '0')}</p>
                    </div>
                </div>
             </div>

             <div className="border-2 border-cyan p-4 bg-cyan/5">
                <div className="flex items-center gap-2 text-cyan mb-3 font-mono text-sm underline">
                    <Activity size={16} />
                    <span>NEURAL_INPUTS</span>
                </div>
                <ul className="text-[11px] space-y-1 font-mono uppercase text-cyan/70">
                    <li>{'>'} DIR_UP: ARR / W</li>
                    <li>{'>'} DIR_DOWN: ARR / S</li>
                    <li>{'>'} DIR_LEFT: ARR / A</li>
                    <li>{'>'} DIR_RIGHT: ARR / D</li>
                    <li className="text-magenta/80 mt-2">!! AVOID_SELF_COLLISION !!</li>
                </ul>
             </div>
          </div>

          {/* Center: CORE_PROCESS */}
          <div className="lg:col-span-6 flex flex-col items-center gap-4 order-1 lg:order-2">
            <div className="w-full flex justify-between items-center mb-2 px-2 font-mono text-[10px] text-magenta">
                <span>[ CORE_TEMP: &&°C ]</span>
                <span className="animate-pulse">● RECORDING_CORE_DATA .</span>
            </div>
            
            <div className="relative p-1 bg-white">
                <SnakeGame onScoreChange={handleScoreChange} isPaused={isPaused} />
                {/* Visual "glitch" artifacts surrounding the game */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-magenta" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-magenta" />
            </div>
            
            <button 
                onClick={() => setIsPaused(!isPaused)}
                className="w-full py-2 bg-cyan text-black font-mono font-black italic hover:bg-magenta transition-colors border-b-4 border-white active:translate-y-1"
            >
                {isPaused ? 'RESUME_THREAD_01' : 'TERMINATE_THREAD_01'}
            </button>
          </div>

          {/* Right Column: Audio Processor */}
          <div className="lg:col-span-3 order-3 flex flex-col gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-magenta mb-2">
                <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 border-2 border-magenta border-t-transparent rounded-full" 
                />
                <span className="tracking-widest animate-pulse">DECRYPTION_IN_PROGRESS</span>
            </div>
            <MusicPlayer />
            <div className="mt-4 p-4 border-2 border-dashed border-magenta/30 font-mono text-[9px] text-magenta/50 italic leading-relaxed">
                ERROR: AUDIO_VISUAL_SYNC_DRIFT_DETECTED. SYSTEM_INTEGRITY_STABLE. CONTINUE_EXPERIMENTATION.
            </div>
          </div>

        </div>
      </main>
      
      {/* Background visual artifacts */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]">
        <div className="absolute top-10 right-20 text-[100px] font-black text-magenta/5 opacity-10 select-none font-mono">0101</div>
        <div className="absolute bottom-10 left-20 text-[100px] font-black text-cyan/5 opacity-10 select-none font-mono">VOID</div>
      </div>
    </div>
  );
}
