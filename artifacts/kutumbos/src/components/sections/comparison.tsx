import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const rows = [
  { feature: "Chat-based", kutumbos: "Organized" },
  { feature: "Memory-based", kutumbos: "Clear records" },
  { feature: "Scattered", kutumbos: "One place" },
  { feature: "Reactive", kutumbos: "In control" },
];

export function Comparison() {
  return (
    <section className="py-24 lg:py-32 bg-background border-t border-border relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-8">
            Why this actually works
          </h3>
          
          <div className="inline-flex flex-col items-start gap-2 text-muted-foreground text-lg italic mb-8 mx-auto p-6 rounded-2xl bg-secondary/50 border border-border">
            <span className="font-medium text-foreground not-italic mb-2">Instead of:</span>
            <span className="line-through decoration-red-500/50 flex items-center gap-2"><X className="w-4 h-4 text-red-500" /> searching chats</span>
            <span className="line-through decoration-red-500/50 flex items-center gap-2"><X className="w-4 h-4 text-red-500" /> asking each other</span>
            <span className="line-through decoration-red-500/50 flex items-center gap-2"><X className="w-4 h-4 text-red-500" /> trying to remember</span>
            <span className="mt-4 font-bold text-amber-600 not-italic text-xl">You just open one place and see everything.</span>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-3xl border border-border overflow-hidden shadow-2xl relative"
        >
          <div className="grid grid-cols-2 bg-secondary/50 border-b border-border text-base md:text-lg font-bold">
            <div className="p-6 text-center text-muted-foreground border-r border-border">Today</div>
            <div className="p-6 text-center text-amber-600 bg-amber-500/5 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-amber-500"></div>
              With KutumbOS
            </div>
          </div>
          
          <div className="divide-y divide-border">
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-2 items-stretch hover:bg-secondary/30 transition-colors">
                
                <div className="p-6 text-center flex flex-col items-center justify-center gap-3 text-muted-foreground border-r border-border">
                  <span>{row.feature}</span>
                </div>
                
                <div className="p-6 text-center flex flex-col items-center justify-center gap-3 text-foreground font-bold bg-amber-500/5 relative">
                  <div className="absolute inset-y-0 left-0 w-[1px] bg-amber-500/20"></div>
                  <div className="absolute inset-y-0 right-0 w-[1px] bg-amber-500/20"></div>
                  <Check className="w-6 h-6 text-amber-500" />
                  <span>{row.kutumbos}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
