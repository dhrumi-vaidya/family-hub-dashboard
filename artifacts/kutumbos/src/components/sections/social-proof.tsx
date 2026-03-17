import { motion } from "framer-motion";
import { Users, Heart, Zap } from "lucide-react";

export function SocialProof() {
  return (
    <section className="py-24 bg-secondary/30 border-y border-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="flex flex-col items-center text-center p-8 bg-card rounded-3xl border border-border shadow-sm">
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20 text-amber-600">
              <Heart className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-foreground text-lg">Made for real Indian families</h4>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-card rounded-3xl border border-border shadow-sm">
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20 text-amber-600">
              <Users className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-foreground text-lg">Simple enough for parents</h4>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-card rounded-3xl border border-border shadow-sm">
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20 text-amber-600">
              <Zap className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-foreground text-lg">Useful from day one</h4>
          </div>
        </div>

        <div className="text-center mt-12 space-y-4">
          <p className="text-xl text-foreground font-semibold">
            Families already using it to track daily life
          </p>
          <p className="text-muted-foreground font-medium">
            Works across parents, kids, and working members
          </p>
        </div>

      </div>
    </section>
  );
}
