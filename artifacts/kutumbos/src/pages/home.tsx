import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Solution } from "@/components/sections/solution";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Comparison } from "@/components/sections/comparison";
import { SocialProof } from "@/components/sections/social-proof";
import { Security } from "@/components/sections/security";
import { FamilyScore } from "@/components/sections/family-score";
import { Faq } from "@/components/sections/faq";
import { CtaSection } from "@/components/sections/cta-section";
import { Footer } from "@/components/footer";
import { WaitlistModal } from "@/components/waitlist-modal";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Home() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [dismissStickyCta, setDismissStickyCta] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);

  const openWaitlist = () => setIsWaitlistOpen(true);

  // Scroll tracking for Sticky Bottom CTA
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 70 && !dismissStickyCta) {
        setShowStickyCta(true);
      } else {
        setShowStickyCta(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissStickyCta]);

  // Exit Intent Popup
  useEffect(() => {
    const hasSeenExitIntent = sessionStorage.getItem("exitIntentShown");
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 0 && !hasSeenExitIntent) {
        setShowExitIntent(true);
        sessionStorage.setItem("exitIntentShown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  return (
    <main className="min-h-screen bg-background relative">
      <Navbar onOpenWaitlist={openWaitlist} />
      
      <Hero onOpenWaitlist={openWaitlist} />
      <Problem />
      <Solution />
      <HowItWorks />
      <Comparison />
      <SocialProof />
      <Security />
      <FamilyScore onOpenWaitlist={openWaitlist} />
      <Faq />
      <CtaSection onOpenWaitlist={openWaitlist} />
      
      <Footer />

      <WaitlistModal 
        isOpen={isWaitlistOpen} 
        onOpenChange={setIsWaitlistOpen} 
      />

      {/* Sticky Bottom CTA */}
      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 inset-x-0 z-40 p-4 flex justify-center pointer-events-none"
          >
            <div className="bg-card/80 backdrop-blur-xl border border-border shadow-2xl rounded-2xl px-6 py-3 flex items-center gap-6 pointer-events-auto">
              <span className="font-semibold text-foreground hidden sm:block">
                Everything is still scattered.
              </span>
              <Button onClick={openWaitlist} variant="accent" className="bg-amber-500 hover:bg-amber-600 text-navy-900 font-bold whitespace-nowrap">
                Start in 2 minutes
              </Button>
              <button 
                onClick={() => {
                  setDismissStickyCta(true);
                  setShowStickyCta(false);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitIntent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card border border-border shadow-2xl rounded-3xl p-8 max-w-md w-full text-center relative"
            >
              <h3 className="text-3xl font-display font-bold text-foreground mb-3">
                Still managing everything manually?
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Start in 2 minutes, it's free.
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  size="lg" 
                  onClick={() => {
                    setShowExitIntent(false);
                    openWaitlist();
                  }}
                  className="w-full text-lg h-14 bg-amber-500 hover:bg-amber-600 text-navy-900 font-bold"
                >
                  Yes, let's do this
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowExitIntent(false)}
                  className="w-full text-muted-foreground hover:text-foreground"
                >
                  Maybe later
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
