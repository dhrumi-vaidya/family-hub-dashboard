import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const solutions = [
  {
    num: "01",
    title: "Expenses",
    description: "Everyone adds what they spend. You can finally see where money is going.",
  },
  {
    num: "02",
    title: "Health Records",
    description: "Upload once. Find it anytime — especially when it matters.",
  },
  {
    num: "03",
    title: "Tasks",
    description: "Assign once. No need to remind again and again.",
  },
  {
    num: "04",
    title: "Family Access",
    description: "Everyone sees what they need. No confusion.",
  }
];

export function Solution() {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h3 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
            Let's fix this properly
          </h3>
          <p className="text-xl text-muted-foreground font-medium">
            Instead of managing everything in pieces, put your family on one shared place.
          </p>
        </div>

        {/* Before / After Table */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="grid grid-cols-2 rounded-2xl overflow-hidden border border-border shadow-xl">
            <div className="bg-red-500/5 p-6 md:p-8 flex flex-col gap-6">
              <h4 className="text-lg font-bold text-red-500/80 mb-2 uppercase tracking-wider text-center">Before</h4>
              <div className="flex items-center gap-4 text-foreground/80">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="font-medium text-sm md:text-base">WhatsApp chats</span>
              </div>
              <div className="flex items-center gap-4 text-foreground/80">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="font-medium text-sm md:text-base">Gallery photos</span>
              </div>
              <div className="flex items-center gap-4 text-foreground/80">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <X className="w-4 h-4 text-red-500" />
                </div>
                <span className="font-medium text-sm md:text-base">Verbal reminders</span>
              </div>
            </div>
            
            <div className="bg-amber-500/5 p-6 md:p-8 flex flex-col gap-6 border-l border-border relative">
              <h4 className="text-lg font-bold text-amber-600 mb-2 uppercase tracking-wider text-center">After</h4>
              <div className="flex items-center gap-4 text-foreground">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-amber-600" />
                </div>
                <span className="font-bold text-sm md:text-base">One dashboard</span>
              </div>
              <div className="flex items-center gap-4 text-foreground">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-amber-600" />
                </div>
                <span className="font-bold text-sm md:text-base">Organized records</span>
              </div>
              <div className="flex items-center gap-4 text-foreground">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-amber-600" />
                </div>
                <span className="font-bold text-sm md:text-base">Clear tasks</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl bg-card border border-border hover:border-amber-500/30 transition-all shadow-md"
            >
              <div className="text-3xl font-display font-bold text-amber-500/50 mb-4">
                {solution.num}
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">{solution.title}</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {solution.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
