import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ShieldCheck, Menu } from "lucide-react";
import { Button } from "./ui/button";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-accent selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary text-white p-1.5 rounded-lg group-hover:bg-accent transition-colors duration-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-primary">CheckMyFiling</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How it works</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</a>
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button size="sm" className="rounded-full px-5">Get Started</Button>
          </div>
          
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="fixed -top-[20%] -right-[10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="fixed top-[40%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        {children}
      </main>

      <footer className="border-t py-12 bg-white mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 CheckMyFiling. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
