import { TopBar } from '../components/layout/TopBar';
import { DesignWorkspace } from '../components/lab/DesignWorkspace';

/**
 * MUNDA Light Lab — one door, one light, a few controls,
 * and the result is visible immediately.
 */
export function DesignLabScreen() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-ink">
      <TopBar />
      <DesignWorkspace />
    </div>
  );
}
