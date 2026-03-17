import { Check, X } from "lucide-react";

const rows = [
  { feature: "System Approach", others: "Chat-based", kutumbos: "Structured system" },
  { feature: "Data Persistence", others: "Memory-driven", kutumbos: "Data-driven" },
  { feature: "Tooling", others: "Fragmented tools", kutumbos: "Unified control" },
  { feature: "Management Style", others: "Reactive", kutumbos: "Proactive" },
];

export function Comparison() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-5xl font-display font-bold text-primary">
            Why This Is Not Another App
          </h3>
        </div>

        <div className="bg-background rounded-3xl border border-border overflow-hidden shadow-sm">
          <div className="grid grid-cols-3 bg-secondary/50 border-b border-border p-6 text-sm md:text-lg font-bold">
            <div className="text-muted-foreground">The Approach</div>
            <div className="text-center text-muted-foreground">Other Methods</div>
            <div className="text-center text-accent">KutumbOS</div>
          </div>
          
          <div className="divide-y divide-border">
            {rows.map((row, i) => (
              <div key={i} className="grid grid-cols-3 p-6 items-center text-sm md:text-base hover:bg-secondary/10 transition-colors">
                <div className="font-medium text-primary hidden md:block">{row.feature}</div>
                <div className="font-medium text-primary md:hidden">Approach</div>
                
                <div className="text-center flex flex-col items-center gap-2 text-muted-foreground">
                  <X className="w-5 h-5 text-destructive/60" />
                  <span>{row.others}</span>
                </div>
                
                <div className="text-center flex flex-col items-center gap-2 text-primary font-bold">
                  <Check className="w-5 h-5 text-accent" />
                  <span>{row.kutumbos}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
