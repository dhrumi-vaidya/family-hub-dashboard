import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Create Your Family",
    description: "Set up your family profile in seconds. No complex configurations.",
  },
  {
    num: "02",
    title: "Invite Members",
    description: "Share via Email or WhatsApp. Absolutely no learning curve for parents.",
  },
  {
    num: "03",
    title: "Start Managing Everything",
    description: "Expenses, health records, tasks — all unified in one secure place.",
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h3 className="text-3xl md:text-5xl font-display font-bold text-primary mb-4">
            Set Up in Under 2 Minutes
          </h3>
          <p className="text-lg text-muted-foreground">
            Built for non-tech users. Control without complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border/80 z-0"></div>
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 bg-white border-4 border-background shadow-xl shadow-primary/5 rounded-full flex items-center justify-center mb-8 relative">
                <span className="text-3xl font-display font-bold text-accent">{step.num}</span>
              </div>
              <h4 className="text-2xl font-bold text-primary mb-4">{step.title}</h4>
              <p className="text-muted-foreground leading-relaxed px-4">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
