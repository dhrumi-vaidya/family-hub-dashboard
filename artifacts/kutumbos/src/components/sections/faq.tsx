import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Will my parents be able to use this?",
    a: "Yes. It's made to be simple. No learning needed."
  },
  {
    q: "Do I need everyone to join?",
    a: "No. Start yourself and add others later."
  },
  {
    q: "Is my data safe?",
    a: "Yes. Everything is private to your family."
  },
  {
    q: "What if we stop using it?",
    a: "Your data stays with you."
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. Fully optimized for phones."
  }
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-background border-b border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-display font-bold text-foreground">
            Common questions
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-semibold text-lg text-foreground">{faq.q}</span>
                  {isOpen ? (
                    <Minus className="w-5 h-5 text-muted-foreground shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 text-muted-foreground font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
