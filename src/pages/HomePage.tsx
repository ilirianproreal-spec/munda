import { Navbar } from '../sections/Navbar';
import { Hero } from '../sections/Hero';
import { TechnologySection } from '../sections/TechnologySection';
import { AutomotiveSection } from '../sections/AutomotiveSection';
import { LightLabSection } from '../sections/LightLabSection';
import { AboutSection } from '../sections/AboutSection';
import { CareersSection } from '../sections/CareersSection';
import { Footer } from '../sections/Footer';

export default function HomePage() {
  return (
    <div className="bg-ink text-white">
      <Navbar />
      <main>
        <Hero />
        <TechnologySection />
        <AutomotiveSection />
        <LightLabSection />
        <AboutSection />
        <CareersSection />
      </main>
      <Footer />
    </div>
  );
}
