import { motion } from "framer-motion";

export function SocialProof() {
  return (
    <section className="py-20 bg-secondary/30 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-border/50">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl">🇮🇳</span>
            </div>
            <h4 className="font-bold text-primary">Designed for real Indian families</h4>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-border/50">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl">🤝</span>
            </div>
            <h4 className="font-bold text-primary">Built to reduce dependency</h4>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm border border-border/50">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl">🔒</span>
            </div>
            <h4 className="font-bold text-primary">Private by design</h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.blockquote 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center p-8 text-xl font-display italic text-primary/80"
          >
            "Your family runs on memory. That's the problem."
          </motion.blockquote>
          <motion.blockquote 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-center p-8 text-xl font-display italic text-primary/80"
          >
            "Important things shouldn't depend on WhatsApp chats."
          </motion.blockquote>
          <motion.blockquote 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="text-center p-8 text-xl font-display italic text-primary/80"
          >
            "If one person stops managing everything, what breaks?"
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}
