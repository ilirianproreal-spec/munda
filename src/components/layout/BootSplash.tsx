import { motion } from 'framer-motion';
import { LogoMark } from './LogoMark';

export function BootSplash() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
    >
      <LogoMark className="h-14 w-14 animate-pulse-soft text-electric" />
      <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.45em] text-fog">
        MUNDA Light Lab
      </div>
      <div className="mt-5 h-[2px] w-44 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-full origin-left animate-boot-bar bg-gradient-to-r from-violet via-electric to-white" />
      </div>
      <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.3em] text-fog/50">
        Duke ngarkuar sistemin
      </div>
    </motion.div>
  );
}
