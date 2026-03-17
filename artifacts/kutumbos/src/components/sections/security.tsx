import { ShieldCheck, Users, Key, Ban } from "lucide-react";

const features = [
  { icon: ShieldCheck, text: "Family-level data isolation" },
  { icon: Users, text: "Role-based permissions" },
  { icon: Key, text: "Emergency access controls" },
  { icon: Ban, text: "No data selling. No ads." },
];

export function Security() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-3xl md:text-5xl font-display font-bold text-primary mb-12">
          Your Family's Data, Protected
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-4 bg-background p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <feature.icon className="w-5 h-5 text-accent" />
              </div>
              <span className="text-lg font-semibold text-primary text-left">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
