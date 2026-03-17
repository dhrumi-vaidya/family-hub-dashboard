import { ShieldCheck, Users, Key, Ban } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Data Isolation", text: "Family-level data isolation" },
  { icon: Users, title: "Permissions", text: "Role-based access control" },
  { icon: Key, title: "Emergency", text: "Secure emergency access" },
  { icon: Ban, title: "Zero Ads", text: "No data selling. No ads." },
];

export function Security() {
  return (
    <section className="py-24 lg:py-32 bg-background bg-grid relative border-b border-white/5">
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center p-3 mb-8 rounded-2xl bg-white/5 border border-white/10 text-amber-400 glow-amber">
          <ShieldCheck className="w-10 h-10" />
        </div>
        
        <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
          Bank-Level Security for Your Family
        </h3>
        <p className="text-xl text-white/60 mb-16 max-w-2xl mx-auto font-medium">
          We treat your family's data with the exact same rigor that financial institutions use.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center bg-navy-900 p-8 rounded-3xl border border-white/10 hover:border-amber-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
              <span className="text-sm font-medium text-white/50">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
