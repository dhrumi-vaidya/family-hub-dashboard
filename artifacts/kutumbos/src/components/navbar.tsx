import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onOpenWaitlist: () => void;
}

export function Navbar({ onOpenWaitlist }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/70 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg relative group">
            <div className="absolute inset-0 rounded-xl bg-amber-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-4 h-4 bg-amber-400 rounded-sm shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
          </div>
          <span className="font-display font-bold text-2xl text-white tracking-tight">KutumbOS</span>
        </div>
        
        <Button 
          variant="accent"
          size="sm"
          onClick={onOpenWaitlist}
          className="hidden sm:inline-flex bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-amber-500/50 transition-all rounded-full px-6"
        >
          Start Your Family System
        </Button>
        
        <Button 
          variant="accent"
          size="sm"
          onClick={onOpenWaitlist}
          className="sm:hidden bg-amber-500 text-navy-900 font-bold"
        >
          Start Now
        </Button>
      </div>
    </header>
  );
}
