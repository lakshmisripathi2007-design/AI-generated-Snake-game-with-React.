import { motion } from 'motion/react';

export default function GlitchOverlay() {
  return (
    <>
      {/* Repetitive Background Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex flex-wrap opacity-[0.05] select-none">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="text-white font-mono text-[2vw] p-8 whitespace-nowrap">
            THIS CONTENT IS NOT AVAILABLE
          </div>
        ))}
      </div>

      <div className="crt-overlay" />
      <div className="scanline" />
      <div className="fixed inset-0 pointer-events-none z-[110] opacity-[0.03]">
        <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uWUqWMrS/giphy.gif')] mix-blend-screen" />
      </div>
      
      {/* Random Screen Tearing Lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed left-0 w-full h-[1px] bg-magenta/30 z-[105] pointer-events-none"
          animate={{
            top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [0, 0.5, 0],
            scaleX: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 0.5,
            repeat: Infinity,
            repeatType: "mirror",
            delay: Math.random() * 2
          }}
        />
      ))}

      {/* Extreme Glitch Blocks */}
      <motion.div
        className="fixed top-1/4 left-10 w-20 h-10 bg-cyan/20 z-[105] pointer-events-none"
        animate={{
          x: [0, 100, -50, 0],
          opacity: [0, 0.4, 0],
          skewX: [0, 45, -45, 0],
        }}
        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5 }}
      />
    </>
  );
}
