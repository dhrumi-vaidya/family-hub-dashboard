import { Button } from "@/components/ui/button";

interface CtaSectionProps {
  onOpenWaitlist: () => void;
}

export function CtaSection({ onOpenWaitlist }: CtaSectionProps) {
  return (
    <section className="py-24 lg:py-32 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent via-primary to-primary"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight tracking-tight">
          Stop Managing Your Family in Chaos
        </h2>
        
        <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 font-medium">
          Start before things get messy again. <br className="hidden md:block"/> Fix the system before the next emergency.
        </p>
        
        <Button 
          size="lg" 
          variant="accent" 
          onClick={onOpenWaitlist}
          className="text-xl px-10 h-16 rounded-2xl shadow-2xl shadow-black/50"
        >
          Start Your Family System Now
        </Button>
      </div>
    </section>
  );
}
