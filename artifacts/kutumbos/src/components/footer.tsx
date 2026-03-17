export function Footer() {
  return (
    <footer className="bg-background py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
            <div className="w-2 h-2 bg-accent rounded-[2px]" />
          </div>
          <span className="font-display font-bold text-xl text-primary">KutumbOS</span>
        </div>
        <p className="text-muted-foreground font-medium mb-8">
          Infrastructure for families.
        </p>
        <p className="text-sm text-muted-foreground/60">
          © {new Date().getFullYear()} KutumbOS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
