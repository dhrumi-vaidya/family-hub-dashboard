import { motion } from "framer-motion";
import { ShieldCheck, HeartHandshake, Lock } from "lucide-react";

export function SocialProof() {
  return (
    <section className="py-24 bg-navy-800 border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="flex flex-col items-center text-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 glow-amber text-amber-400">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-white text-lg">Designed for Real Indian Families</h4>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 glow-amber text-amber-400">
              <span className="text-2xl font-bold">∞</span>
            </div>
            <h4 className="font-bold text-white text-lg">Built to Reduce Dependency</h4>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 glow-amber text-amber-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-white text-lg">Private by Design</h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="p-8 rounded-3xl bg-navy-900 border border-white/10 relative"
          >
            <span className="absolute -top-6 -left-2 text-6xl text-amber-500/20 font-display">"</span>
            <blockquote className="text-xl font-display italic text-white/80 relative z-10 leading-relaxed">
              Your family runs on memory. That's the problem.
            </blockquote>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl bg-navy-900 border border-white/10 relative"
          >
            <span className="absolute -top-6 -left-2 text-6xl text-amber-500/20 font-display">"</span>
            <blockquote className="text-xl font-display italic text-white/80 relative z-10 leading-relaxed">
              Important things shouldn't depend on WhatsApp chats.
            </blockquote>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="p-8 rounded-3xl bg-navy-900 border border-white/10 relative"
          >
            <span className="absolute -top-6 -left-2 text-6xl text-amber-500/20 font-display">"</span>
            <blockquote className="text-xl font-display italic text-white/80 relative z-10 leading-relaxed">
              If one person stops managing everything, what breaks?
            </blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
