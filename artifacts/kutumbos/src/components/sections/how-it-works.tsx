import { motion } from "framer-motion";
import { UserPlus, Send, Zap } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Create Your Family",
    description: "Set up your family profile in seconds. No complex configurations.",
    icon: UserPlus
  },
  {
    num: "02",
    title: "Invite Members",
    description: "Share via Email or WhatsApp. Absolutely no learning curve for parents.",
    icon: Send
  },
  {
    num: "03",
    title: "Manage Everything",
    description: "Expenses, health records, tasks — all unified in one secure place.",
    icon: Zap
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-navy-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h3 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Set Up in Under <span className="text-amber-400">2 Minutes</span>
          </h3>
          <p className="text-xl text-white/60 font-medium">
            Built for non-tech users. Control without complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Gradient) */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-1 bg-gradient-to-r from-amber-500/20 via-amber-500/50 to-purple-500/20 -translate-y-1/2 z-0 rounded-full"></div>
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="text-[6rem] md:text-[8rem] font-display font-black text-white/5 group-hover:text-white/10 transition-colors absolute -top-16 md:-top-24 pointer-events-none select-none">
                {step.num}
              </div>
              
              <div className="w-20 h-20 bg-navy-800 border border-white/10 rounded-2xl flex items-center justify-center mb-8 relative glass-card group-hover:border-amber-500/50 transition-colors z-10">
                <step.icon className="w-8 h-8 text-amber-400" />
              </div>
              
              <h4 className="text-2xl font-bold text-white mb-4 relative z-10">{step.title}</h4>
              <p className="text-white/60 leading-relaxed px-4 relative z-10 font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
