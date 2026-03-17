import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGetWaitlistCount } from "@workspace/api-client-react";
import { Shield, Smartphone, Zap, Activity, Users, CheckCircle2, IndianRupee } from "lucide-react";

interface HeroProps {
  onOpenWaitlist: () => void;
}

export function Hero({ onOpenWaitlist }: HeroProps) {
  const { data: countData } = useGetWaitlistCount({
    query: { retry: false, refetchOnWindowFocus: false }
  });

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-grain bg-mesh min-h-[90vh] flex items-center">
      {/* Floating Animated Geometric Shapes */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} 
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[10%] w-32 h-32 rounded-full bg-amber-500/10 blur-3xl"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 right-[10%] w-48 h-48 rounded-full bg-purple-500/10 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-primary/80 uppercase tracking-wider">
              {countData && countData.count > 0 ? `${countData.count}+ Families Joined` : "Accepting Waitlist"}
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-[5rem] font-display font-bold text-white leading-[1.05] tracking-tight">
            Your Family Is Running Without a <br />
            <span className="text-gradient">System.</span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium max-w-xl">
            Money, health records, responsibilities, and decisions are scattered across chats, memory, and paper. KutumbOS brings everything into one structured system your entire family can actually use.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Button 
              size="lg" 
              variant="accent" 
              onClick={onOpenWaitlist}
              className="w-full sm:w-auto text-lg px-8 py-7 glow-amber rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 border-none transition-all duration-300 transform hover:scale-[1.02]"
            >
              Start Your Family System
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto text-lg px-8 py-7 rounded-xl border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              See How It Works
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm font-semibold text-white/60">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>2 min setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span>100% Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-400" />
              <span>Mobile-first</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Mockup UI Card */}
        <motion.div
          initial={{ opacity: 0, x: 40, rotateY: 10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ perspective: 1000 }}
          className="relative hidden lg:block"
        >
          <div className="glass-card rounded-3xl p-6 border-l-amber-500/30 border-t-amber-500/30">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-navy-900 font-bold">
                  S
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Sharma Family</h3>
                  <p className="text-white/50 text-sm">Dashboard Overview</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="rounded-full bg-white/5 border-white/10">
                Invite
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Metric 1 */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <IndianRupee className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-white/60 text-sm font-medium">Expenses</span>
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">₹12,400</p>
                <p className="text-xs text-green-400 mt-1">Within budget</p>
              </div>

              {/* Metric 2 */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Activity className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-white/60 text-sm font-medium">Health Records</span>
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">8</p>
                <p className="text-xs text-white/40 mt-1">Latest: Mom's Rx</p>
              </div>

              {/* Metric 3 */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-white/60 text-sm font-medium">Tasks</span>
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">3 <span className="text-lg text-white/40 font-normal">pending</span></p>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-400 w-2/3 h-full rounded-full"></div>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Users className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-white/60 text-sm font-medium">Members</span>
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">5</p>
                <div className="flex -space-x-2 mt-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-white/20 border-2 border-background"></div>
                  ))}
                  <div className="w-6 h-6 rounded-full bg-white/10 border-2 border-background flex items-center justify-center text-[10px]">+1</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
