import { ShieldCheck, Lock, EyeOff } from "lucide-react";

const features = [
  { icon: Lock, title: "Only your family can access it" },
  { icon: EyeOff, title: "No ads. No data sharing" },
  { icon: ShieldCheck, title: "You stay in control" },
];

export function Security() {
  return (
    <section className="py-24 lg:py-32 bg-background relative border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center p-4 mb-8 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600">
          <ShieldCheck className="w-10 h-10" />
        </div>
        
        <h3 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-16">
          This is your family's data
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center bg-card p-8 rounded-3xl border border-border shadow-sm hover:border-amber-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-amber-600" />
              </div>
              <h4 className="text-lg font-bold text-foreground">{feature.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
