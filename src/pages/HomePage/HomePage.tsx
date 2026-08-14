import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import SidebarIndex from '@/components/SidebarIndex';
import GrainOverlay from '@/components/GrainOverlay';
import ExploreModeBanner from '@/components/ExploreModeBanner';
import { SECTIONS } from '@/lib/utils';
import HeroSection from './sections/HeroSection';
import MetricsSection from './sections/MetricsSection';
import ProductsSection from './sections/ProductsSection';
import MobileDemoSection from './sections/MobileDemoSection';
import FeishuSection from './sections/FeishuSection';
import TimelineSection from './sections/TimelineSection';
import CultureSection from './sections/CultureSection';
import StatusLabSection from './sections/StatusLabSection';
import StyleGallerySection from './sections/StyleGallerySection';
import AdvancedLabSection from './sections/AdvancedLabSection';
import DictionarySection from './sections/DictionarySection';
import FaqSection from './sections/FaqSection';
import FooterSection from './sections/FooterSection';
import FabSection from './sections/FabSection';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0].id);

  // 用 IntersectionObserver 跟踪当前所在区域，同步给 Header 与侧边索引
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.05, 0.25, 0.5] },
    );

    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* 颗粒噪点 · 概念 69 */}
      <GrainOverlay conceptId="69" />
      <ExploreModeBanner />
      <Header activeSection={activeSection} />
      <SidebarIndex activeSection={activeSection} />

      <main className="lg:pl-[clamp(200px,15vw,280px)]">
        <HeroSection />
        <MetricsSection />
        <ProductsSection />
        <MobileDemoSection />
        <FeishuSection />
        <TimelineSection />
        <CultureSection />
        <StatusLabSection />
        <StyleGallerySection />
        <AdvancedLabSection />
        <DictionarySection />
        <FaqSection />
        <FooterSection />
      </main>

      <FabSection />
    </div>
  );
}
