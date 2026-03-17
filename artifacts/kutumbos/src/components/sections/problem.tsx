import { motion } from "framer-motion";
import { Wallet, HeartPulse, ListTodo, UserX } from "lucide-react";

const problems = [
  {
    title: "Who paid for this?",
    description: "At the end of the month, no one really knows where the money went.",
    icon: Wallet,
    badge: "HIGH RISK",
    color: "text-red-500"
  },
  {
    title: "Where is that report?",
    description: "You need a medical report urgently… and it's buried somewhere in photos or chats.",
    icon: HeartPulse,
    badge: "CRITICAL",
    color: "text-rose-500"
  },
  {
    title: "I told you to do this",
    description: "Tasks are discussed, not tracked. So they get missed.",
    icon: ListTodo,
    badge: "FREQUENT",
    color: "text-amber-500"
  },
  {
    title: "Ask mom/dad, they know everything",
    description: "One person handles everything. If they're busy, everything stops.",
    icon: UserX,
    badge: "FRAGILE",
    color: "text-orange-500"
  }
];

export function Problem() {
  return (
    <section className="py-24 lg:py-32 bg-secondary/30 relative border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h3 className="text-4xl md:text-6xl font-display font-bold text-foreground tracking-tight">
            This probably sounds <span className="text-amber-500 italic">familiar</span>
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
              className="bg-card backdrop-blur-sm rounded-2xl p-8 border border-border hover:border-border/80 border-l-amber-500/50 hover:border-l-amber-500 shadow-xl hover:-translate-y-1 transition-all duration-300 relative group"
            >
              <div className="absolute top-6 right-6">
                <span className={`text-[10px] font-bold px-2 py-1 rounded bg-primary/5 border border-primary/10 ${problem.color}`}>
                  {problem.badge}
                </span>
              </div>
              
              <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-8 border border-primary/10 group-hover:scale-110 transition-transform">
                <problem.icon className={`w-7 h-7 ${problem.color}`} />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3 tracking-wide">{problem.title}</h4>
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
