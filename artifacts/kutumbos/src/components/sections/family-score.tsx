import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FamilyScoreProps {
  onOpenWaitlist: () => void;
}

export function FamilyScore({ onOpenWaitlist }: FamilyScoreProps) {
  return (
    <section className="py-24 bg-secondary/20 border-b border-border flex items-center justify-center relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-display font-bold text-foreground">
            Your Family Setup
          </h3>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl relative"
        >
          <div className="space-y-8 mb-10">
            {/* Money Tracking */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-foreground">Money tracking</span>
                <span className="font-bold text-amber-600">40%</span>
              </div>
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "40%" }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-amber-500 rounded-full"
                ></motion.div>
              </div>
            </div>
            
            {/* Tasks Managed */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-foreground">Tasks managed</span>
                <span className="font-bold text-blue-500">30%</span>
              </div>
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "30%" }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full bg-blue-500 rounded-full"
                ></motion.div>
              </div>
            </div>

            {/* Health Records */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-foreground">Health records</span>
                <span className="font-bold text-red-500">Missing (0%)</span>
              </div>
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-0"></div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              size="lg" 
              variant="accent" 
              onClick={onOpenWaitlist}
              className="text-lg px-10 py-6 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-navy-900 border-none transition-all duration-300"
            >
              Fix this in 2 minutes
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
