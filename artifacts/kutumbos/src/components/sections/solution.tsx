import { motion } from "framer-motion";
import { Receipt, Stethoscope, CheckSquare, ShieldCheck } from "lucide-react";

const solutions = [
  {
    title: "Family Expense System",
    description: "Track, categorize, and control spending across all members.",
    icon: Receipt,
  },
  {
    title: "Health Record Vault",
    description: "Upload and access medical documents instantly when needed.",
    icon: Stethoscope,
  },
  {
    title: "Responsibility Engine",
    description: "Assign, track, and complete tasks without follow-ups.",
    icon: CheckSquare,
  },
  {
    title: "Role-Based Access",
    description: "Every member sees what they need — nothing more, nothing less.",
    icon: ShieldCheck,
  }
];

export function Solution() {
  return (
    <section className="py-20 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <img 
          src={`${import.meta.env.BASE_URL}images/family-pattern.png`} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-accent uppercase mb-3">The New Standard</h2>
          <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            KutumbOS Fixes This Structurally
          </h3>
          <p className="text-xl text-primary-foreground/80 font-medium">
            Not an app. A system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <solution.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">{solution.title}</h4>
                  <p className="text-primary-foreground/70 leading-relaxed text-lg">
                    {solution.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
