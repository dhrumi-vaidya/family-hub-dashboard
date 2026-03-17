import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGetWaitlistCount } from "@workspace/api-client-react";
import { Shield, Smartphone, Zap } from "lucide-react";

interface HeroProps {
  onOpenWaitlist: () => void;
}

export function Hero({ onOpenWaitlist }: HeroProps) {
  const { data: countData } = useGetWaitlistCount({
    query: { retry: false, refetchOnWindowFocus: false }
  });

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-grain">
      {/* Abstract Background Image */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-abstract.png`} 
          alt="" 
          className="w-full h-full object-cover object-top mix-blend-multiply"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-primary leading-[1.1] tracking-tight">
            Your Family Is Running <br className="hidden sm:block" />
            <span className="text-gradient">Without a System.</span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium">
            Money, health records, responsibilities, and decisions are scattered across chats, memory, and paper. KutumbOS brings everything into one structured system your entire family can actually use.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              variant="accent" 
              onClick={onOpenWaitlist}
              className="w-full sm:w-auto text-lg px-8"
            >
              Start Your Family System
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto text-lg px-8"
            >
              See How It Works
            </Button>
          </div>

          {countData && countData.count > 0 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-sm font-medium text-muted-foreground"
            >
              Join <span className="text-primary font-bold">{countData.count.toLocaleString()}+</span> families already on the waitlist
            </motion.p>
          )}

          <div className="mt-16 pt-8 border-t border-border/60 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-primary/80">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <span>No setup required</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-accent" />
              <span>Works on mobile</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <span>Private family data</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
