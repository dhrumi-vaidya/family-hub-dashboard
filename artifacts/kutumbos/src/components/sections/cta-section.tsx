import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CtaSectionProps {
  onOpenWaitlist: () => void;
}

export function CtaSection({ onOpenWaitlist }: CtaSectionProps) {
  return (
    <section className="py-32 bg-background relative overflow-hidden flex items-center justify-center min-h-[60vh]">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-amber-500/10 to-background pointer-events-none z-0"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-display font-black text-foreground mb-6 leading-tight tracking-tight">
            Right now, everything is scattered.
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-medium max-w-2xl mx-auto">
            You don't need another app. You need one place that actually works.
          </p>
          
          <Button 
            size="lg" 
            variant="accent" 
            onClick={onOpenWaitlist}
            className="text-xl md:text-2xl px-12 h-20 rounded-2xl shadow-[0_0_40px_-10px_rgba(245,158,11,0.4)] bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 border-none transition-all duration-300 transform hover:scale-105 font-bold text-navy-900"
          >
            Start your family on KutumbOS
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
