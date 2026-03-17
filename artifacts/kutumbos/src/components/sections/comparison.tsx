import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const rows = [
  { feature: "System Approach", others: "Chat-based & scattered", kutumbos: "Structured unified system" },
  { feature: "Data Persistence", others: "Lost in history", kutumbos: "Permanent & retrievable" },
  { feature: "Tooling", others: "5+ fragmented tools", kutumbos: "Single control center" },
  { feature: "Management Style", others: "Reactive & chaotic", kutumbos: "Proactive & organized" },
  { feature: "Privacy", others: "Data used for ads", kutumbos: "Absolute zero tracking" },
];

export function Comparison() {
  return (
    <section className="py-24 lg:py-32 bg-background border-t border-white/5 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h3 className="text-4xl md:text-6xl font-display font-bold text-white">
            Why This Is <span className="text-amber-400">Not</span> Another App
          </h3>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-navy-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative"
        >
          {/* VS Badge */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-navy-900 border border-white/10 px-4 py-1 rounded-full text-xs font-bold text-white/50 z-20 hidden md:block">
            VS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 bg-white/5 border-b border-white/10 text-sm md:text-lg font-bold">
            <div className="hidden md:block p-6 text-white/60">Capabilities</div>
            <div className="p-6 text-center text-white/40 border-r border-white/5">The Old Way</div>
            <div className="p-6 text-center text-amber-400 bg-amber-500/5 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-amber-400"></div>
              KutumbOS
            </div>
          </div>
          
          <div className="divide-y divide-white/5">
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-3 items-stretch hover:bg-white/[0.02] transition-colors">
                <div className="p-6 font-medium text-white/80 hidden md:flex items-center">
                  {row.feature}
                </div>
                
                {/* Mobile Label */}
                <div className="p-4 md:hidden font-medium text-white/80 border-b border-white/5 bg-white/5 text-center">
                  {row.feature}
                </div>
                
                <div className="p-6 text-center flex flex-col items-center justify-center gap-3 text-white/40 border-r border-white/5">
                  <X className="w-5 h-5 text-red-500/50" />
                  <span className="line-through decoration-white/20">{row.others}</span>
                </div>
                
                <div className="p-6 text-center flex flex-col items-center justify-center gap-3 text-white font-bold bg-amber-500/5 relative">
                  <div className="absolute inset-y-0 left-0 w-[1px] bg-amber-500/20"></div>
                  <div className="absolute inset-y-0 right-0 w-[1px] bg-amber-500/20"></div>
                  <Check className="w-6 h-6 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
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
