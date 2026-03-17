import { motion } from "framer-motion";
import { Wallet, HeartPulse, ListTodo, UserX } from "lucide-react";

const problems = [
  {
    title: "Money Chaos",
    description: "No clear record of who spent what, where money is going, or if you're overspending.",
    icon: Wallet,
  },
  {
    title: "Health Risk",
    description: "Medical records are lost, scattered, or unavailable when urgently needed.",
    icon: HeartPulse,
  },
  {
    title: "Responsibility Confusion",
    description: "Tasks are discussed but not tracked. Things get missed.",
    icon: ListTodo,
  },
  {
    title: "Dependency on One Person",
    description: "One family member manages everything → single point of failure.",
    icon: UserX,
  }
];

export function Problem() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-accent uppercase mb-3">The Status Quo</h2>
          <h3 className="text-3xl md:text-5xl font-display font-bold text-primary">What's Actually Broken</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mb-6">
                <problem.icon className="w-6 h-6 text-destructive" />
              </div>
              <h4 className="text-xl font-bold text-primary mb-3">{problem.title}</h4>
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
