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
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <div className="w-3 h-3 bg-accent rounded-sm" />
          </div>
          <span className="font-display font-bold text-2xl text-primary tracking-tight">KutumbOS</span>
        </div>
        
        <Button 
          variant={scrolled ? "accent" : "default"} 
          size="sm"
          onClick={onOpenWaitlist}
          className="hidden sm:inline-flex"
        >
          Start Your Family System
        </Button>
        <Button 
          variant={scrolled ? "accent" : "default"} 
          size="sm"
          onClick={onOpenWaitlist}
          className="sm:hidden"
        >
          Start Now
        </Button>
      </div>
    </header>
  );
}
