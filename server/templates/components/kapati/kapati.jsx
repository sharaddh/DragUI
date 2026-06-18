import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function Component() {
  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    // Calculate center of the button relative to viewport (0.0 to 1.0)
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    const duration = 900; // Extended for natural fall time
    const end = Date.now() + duration;

    const frame = () => {
      const timeLeft = end - Date.now();
      const progress = 1 - (timeLeft / duration);
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x, y },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#fbbf24'],
        gravity: 1.1,      // Natural pull
        decay: 0.94,       // Slow down over time
        drift: 0,          // No wind
        flat: false,       // Enable 3D tumbling
        scalar: 0.8 + Math.random() * 0.4, // Randomize size (0.8x to 1.2x)
      });

      // Burst 2: Right angle
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x, y },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#fbbf24'],
        gravity: 1.1,
        decay: 0.94,
        drift: 0,
        flat: false,       // Enable 3D tumbling
        scalar: 0.8 + Math.random() * 0.4,
      });

      if (timeLeft > 0) {
        requestAnimationFrame(frame);
      }
    };
    console.log("test")
    frame();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(99, 102, 241, 0.2)" }}
      whileTap={{ scale: 0.92, boxShadow: "0px 2px 5px rgba(99, 102, 241, 0.1)" }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="relative overflow-hidden bg-gradient-to-br from-zinc-100 to-white px-8 py-4 font-bold text-zinc-800 rounded-xl shadow-sm border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      onClick={handleClick}
      type="button"
    >
      <span className="relative z-10 flex items-center gap-2">
        Click Me
        <motion.span
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          ✨
        </motion.span>
      </span>
      {/* Subtle sheen effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full"
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </motion.button>
  );
}   