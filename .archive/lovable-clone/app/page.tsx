import { Suspense } from 'react'
import { Header } from '@/components/layout/header'
import { HeroSection } from '@/components/sections/hero-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { ShowcaseSection } from '@/components/sections/showcase-section'
import { CTASection } from '@/components/sections/cta-section'
import { Footer } from '@/components/layout/footer'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <Suspense fallback={<LoadingSpinner />}>
          <FeaturesSection />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <ShowcaseSection />
        </Suspense>
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
