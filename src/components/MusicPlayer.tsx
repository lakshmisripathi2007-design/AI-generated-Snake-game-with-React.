import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Cyber Pulse",
    artist: "AI Sentinel",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: 2,
    title: "Midnight Synth",
    artist: "Neon Ghost",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "from-fuchsia-500 to-pink-600"
  },
  {
    id: 3,
    title: "Neon Velocity",
    artist: "Vector One",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "from-lime-400 to-green-600"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-cyan p-4 shadow-[10px_10px_0_var(--color-magenta)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />

      <div className="flex items-center gap-4 border-b-2 border-cyan/30 pb-4 mb-4">
        <motion.div
          key={currentTrack.id}
          className={`w-20 h-20 bg-magenta border-2 border-white flex items-center justify-center relative`}
        >
          <Music className="text-black w-8 h-8" />
          {isPlaying && (
            <div className="absolute inset-0 bg-cyan/20 animate-pulse" />
          )}
        </motion.div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 10, opacity: 0 }}
            >
              <h3 className="text-xl font-bold text-magenta truncate glitch-text select-none">
                {currentTrack.title.toUpperCase()}
              </h3>
              <p className="text-cyan text-xs font-mono">_ARTIST: {currentTrack.artist.toUpperCase()}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex items-center gap-2">
            <button onClick={prevTrack} className="p-2 border-2 border-cyan hover:bg-cyan hover:text-black transition-colors">
              <SkipBack size={16} />
            </button>
            <button
              onClick={togglePlay}
              className="flex-1 h-10 bg-magenta text-black flex items-center justify-center font-bold font-mono border-2 border-white hover:bg-cyan active:translate-y-1 transition-all"
            >
              {isPlaying ? 'PAUSE_CORE' : 'EXECUTE_STREAM'}
            </button>
            <button onClick={nextTrack} className="p-2 border-2 border-cyan hover:bg-cyan hover:text-black transition-colors">
              <SkipForward size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-6 w-full bg-cyan/20 relative border-2 border-cyan/50">
          <motion.div
            className="h-full bg-magenta border-r-2 border-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white mix-blend-difference font-mono">
             BUFFERING: {Math.floor(progress)}%
          </div>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-cyan/70">
            <span>PACKET_ID: {Math.random().toString(16).slice(2, 8)}</span>
            <span>FREQ: 44.1KHZ</span>
        </div>
      </div>
    </div>
  );
}
