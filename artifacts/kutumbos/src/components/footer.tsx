export function Footer() {
  return (
    <footer className="bg-background py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <div className="w-3 h-3 bg-amber-400 rounded-sm" />
          </div>
          <span className="font-display font-bold text-2xl text-white">KutumbOS</span>
        </div>
        <p className="text-white/60 font-medium mb-8 text-lg">
          Infrastructure for families.
        </p>
        <div className="flex items-center gap-6 mb-12 text-sm text-white/40">
          <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Contact Support</a>
        </div>
        <p className="text-sm text-white/30">
          © {new Date().getFullYear()} KutumbOS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
