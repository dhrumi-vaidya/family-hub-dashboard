import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Smartphone, Zap, CheckCircle2 } from "lucide-react";

interface HeroProps {
  onOpenWaitlist: () => void;
}

const notifications = [
  {
    id: 1,
    title: "₹850 – Groceries",
    tag: "→ auto tagged",
    color: "bg-amber-500/20 text-amber-500 border-amber-500/30",
    dot: "bg-amber-400"
  },
  {
    id: 2,
    title: "Medical report",
    tag: "→ Uploaded & saved",
    color: "bg-green-500/20 text-green-500 border-green-500/30",
    dot: "bg-green-400"
  },
  {
    id: 3,
    title: "Task",
    tag: "→ Completed ✔",
    color: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    dot: "bg-blue-400"
  }
];

export function Hero({ onOpenWaitlist }: HeroProps) {
  const [headline, setHeadline] = useState("");
  const fullText = "Your family runs on chats, memory… and guesswork.";
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isDeleting && headline.length < fullText.length) {
      timeout = setTimeout(() => {
        setHeadline(fullText.slice(0, headline.length + 1));
      }, 50);
    } else if (!isDeleting && headline.length === fullText.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && headline.length > 0) {
      timeout = setTimeout(() => {
        setHeadline(headline.slice(0, -1));
      }, 30);
    } else if (isDeleting && headline.length === 0) {
      setIsDeleting(false);
    }

    return () => clearTimeout(timeout);
  }, [headline, isDeleting, fullText]);

  const [currentNotif, setCurrentNotif] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotif((prev) => (prev + 1) % notifications.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-background to-background pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-6 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">
              {notifications[currentNotif].tag}
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground leading-[1.1] tracking-tight min-h-[140px] sm:min-h-[160px] lg:min-h-[220px]">
            {headline}<span className="animate-pulse text-amber-500">|</span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed font-medium max-w-xl">
            Expenses are in one WhatsApp chat, medical reports are somewhere in the gallery, and tasks are just 'reminders' people forget. KutumbOS puts everything in one place — so nothing gets lost, missed, or confusing.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Button 
              size="lg" 
              variant="accent" 
              onClick={onOpenWaitlist}
              className="w-full sm:w-auto text-lg px-8 py-7 glow-amber rounded-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 border-none transition-all duration-300 transform hover:scale-[1.02] text-navy-900"
            >
              Start in 2 minutes
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto text-lg px-8 py-7 rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10 backdrop-blur-sm transition-all text-foreground"
            >
              See how it works →
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm font-semibold text-foreground/60">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>No setup headache</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-amber-500" />
              <span>Works on phone</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" />
              <span>Private to your family</span>
            </div>
          </div>
        </motion.div>

        {/* Looping Animation Card */}
        <div className="relative hidden lg:flex items-center justify-center h-[500px]">
          <div className="absolute w-[400px] h-[400px] bg-card rounded-3xl border border-border shadow-2xl overflow-hidden backdrop-blur-xl flex flex-col justify-end p-8 pb-12">
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
            
            <div className="relative h-[200px] w-full flex items-end justify-center">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentNotif}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 1.1 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                  className={`w-full max-w-xs p-5 rounded-2xl border bg-card shadow-xl flex flex-col gap-3 z-10 ${notifications[currentNotif].color.replace('text-', '').replace('bg-', 'bg-card ')}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${notifications[currentNotif].dot}`} />
                    <span className={`text-sm font-semibold ${notifications[currentNotif].color.split(' ')[1]}`}>
                      {notifications[currentNotif].tag}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {notifications[currentNotif].title}
                  </h3>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
