import { motion } from "framer-motion";
import { Wallet, HeartPulse, ListTodo, UserX } from "lucide-react";

const problems = [
  {
    title: "Money Chaos",
    description: "No clear record of who spent what, where money is going, or if you're overspending.",
    icon: Wallet,
    badge: "HIGH RISK",
    color: "text-red-400"
  },
  {
    title: "Health Risk",
    description: "Medical records are lost, scattered, or unavailable when urgently needed.",
    icon: HeartPulse,
    badge: "CRITICAL",
    color: "text-rose-500"
  },
  {
    title: "Responsibility Confusion",
    description: "Tasks are discussed but not tracked. Things get missed continuously.",
    icon: ListTodo,
    badge: "FREQUENT",
    color: "text-amber-400"
  },
  {
    title: "Dependency",
    description: "One family member manages everything → single point of failure.",
    icon: UserX,
    badge: "FRAGILE",
    color: "text-orange-500"
  }
];

export function Problem() {
  return (
    <section className="py-24 lg:py-32 bg-background bg-grid relative border-b border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-0 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-bold tracking-widest text-amber-400 uppercase mb-4">The Status Quo</h2>
          <h3 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">
            What's Actually <span className="text-red-400/90 italic">Broken</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-navy-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/5 hover:border-white/10 border-l-amber-500/50 hover:border-l-amber-400 shadow-2xl shadow-black/20 hover:-translate-y-1 transition-all duration-300 relative group"
            >
              <div className="absolute top-6 right-6">
                <span className={`text-[10px] font-bold px-2 py-1 rounded bg-white/5 border border-white/10 ${problem.color}`}>
                  {problem.badge}
                </span>
              </div>
              
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform">
                <problem.icon className={`w-7 h-7 ${problem.color}`} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3 tracking-wide">{problem.title}</h4>
              <p className="text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
