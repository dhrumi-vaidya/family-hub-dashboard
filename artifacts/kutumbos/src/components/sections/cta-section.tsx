import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CtaSectionProps {
  onOpenWaitlist: () => void;
}

export function CtaSection({ onOpenWaitlist }: CtaSectionProps) {
  return (
    <section className="py-32 bg-navy-900 relative overflow-hidden flex items-center justify-center min-h-[70vh]">
      {/* Massive Glow Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80vw] h-[80vh] bg-amber-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '4s' }}></div>
      </div>
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,#080d1a_100%)] pointer-events-none z-0"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-8 leading-tight tracking-tight">
            Stop Managing Your Family in <span className="text-amber-400">Chaos.</span>
          </h2>
          
          <p className="text-2xl text-white/80 mb-12 font-medium max-w-2xl mx-auto">
            Start before things get messy again. Fix the system before the next emergency.
          </p>
          
          <Button 
            size="lg" 
            variant="accent" 
            onClick={onOpenWaitlist}
            className="text-2xl px-12 h-20 rounded-2xl shadow-[0_0_40px_-10px_rgba(245,158,11,0.6)] bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 border-none transition-all duration-300 transform hover:scale-105 font-bold text-navy-900"
          >
            Start Your Family System Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
