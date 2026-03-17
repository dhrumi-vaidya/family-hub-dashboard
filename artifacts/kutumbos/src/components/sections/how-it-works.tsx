import { motion } from "framer-motion";
import { UserPlus, Send, Zap } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Create your family",
    description: "Give it a name and you're ready.",
    icon: UserPlus
  },
  {
    num: "02",
    title: "Invite members",
    description: "Send a simple link on WhatsApp or email.",
    icon: Send
  },
  {
    num: "03",
    title: "Start using it",
    description: "Add expenses, upload reports, assign tasks.",
    icon: Zap
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-secondary/30 relative border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h3 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Set up in less than <span className="text-amber-500">2 minutes</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-border -translate-y-1/2 z-0 rounded-full"></div>
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="text-[6rem] md:text-[8rem] font-display font-black text-primary/5 group-hover:text-primary/10 transition-colors absolute -top-16 md:-top-24 pointer-events-none select-none">
                {step.num}
              </div>
              
              <div className="w-20 h-20 bg-card border border-border shadow-lg rounded-2xl flex items-center justify-center mb-8 relative group-hover:border-amber-500/50 transition-colors z-10">
                <step.icon className="w-8 h-8 text-amber-500" />
              </div>
              
              <h4 className="text-2xl font-bold text-foreground mb-4 relative z-10">{step.title}</h4>
              <p className="text-muted-foreground leading-relaxed px-4 relative z-10 font-medium">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
