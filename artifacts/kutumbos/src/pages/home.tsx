import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Solution } from "@/components/sections/solution";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Comparison } from "@/components/sections/comparison";
import { SocialProof } from "@/components/sections/social-proof";
import { Security } from "@/components/sections/security";
import { CtaSection } from "@/components/sections/cta-section";
import { Footer } from "@/components/footer";
import { WaitlistModal } from "@/components/waitlist-modal";

export default function Home() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const openWaitlist = () => setIsWaitlistOpen(true);

  return (
    <main className="min-h-screen bg-background">
      <Navbar onOpenWaitlist={openWaitlist} />
      
      <Hero onOpenWaitlist={openWaitlist} />
      <Problem />
      <Solution />
      <HowItWorks />
      <Comparison />
      <SocialProof />
      <Security />
      <CtaSection onOpenWaitlist={openWaitlist} />
      
      <Footer />

      <WaitlistModal 
        isOpen={isWaitlistOpen} 
        onOpenChange={setIsWaitlistOpen} 
      />
    </main>
  );
}
