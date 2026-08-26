import { AnimatePresence, motion } from 'framer-motion';
import { TopBar } from '../components/layout/TopBar';
import { DesignWorkspace } from '../components/lab/DesignWorkspace';
import { FinalView } from '../components/lab/FinalView';
import { useDesignStore } from '../store/designStore';

/**
 * HERMES Light Lab — one door, four controls, live preview:
 *  DESIGN YOUR LIGHT → YOUR DESIGN.
 */
export function DesignLabScreen() {
  const step = useDesignStore((s) => s.step);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-ink">
      <TopBar />

      <AnimatePresence mode="wait">
        {step === 'design' && (
          <motion.div
            key="design"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <DesignWorkspace />
          </motion.div>
        )}
        {step === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <FinalView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
