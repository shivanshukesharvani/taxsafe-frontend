import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, Zap, ChevronRight, CheckCircle2 } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Landing() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full pt-20 pb-32 px-4 container mx-auto text-center relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold border border-accent/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Updated for FY 2024-25
          </motion.div>
          
          <motion.h1 variants={item} className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary mb-6 text-balance">
            Check your tax filing <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-600">
               in 2 minutes.
            </span>
          </motion.h1>
          
          <motion.p variants={item} className="text-xl text-muted-foreground mb-10 max-w-2xl text-balance leading-relaxed">
            Find common filing mistakes automatically before the tax department does. Avoid notices, penalties, and delays.
          </motion.p>
          
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/wizard">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 shadow-xl shadow-accent/20">
                Start Free Check
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
              View Sample Report
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div variants={item} className="mt-12 pt-8 border-t border-border/50 w-full max-w-lg">
            <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-semibold">Trusted by professionals from</p>
            <div className="flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Simple placeholder logos */}
              <div className="text-lg font-bold font-serif">FinCorp</div>
              <div className="text-lg font-bold font-mono">TaxAI</div>
              <div className="text-lg font-bold italic">AuditFlow</div>
              <div className="text-lg font-bold">Ledger.</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Section with 3D Cards */}
      <section className="w-full py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Why check your filing?</h2>
            <p className="text-muted-foreground text-lg">Even with a CA, simple data entry errors can trigger automated notices. We catch them first.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Risk Assessment",
                desc: "We analyze your ITR against 50+ common high-risk patterns used by tax authorities."
              },
              {
                icon: FileText,
                title: "Document Match",
                desc: "Verify if your claimed deductions match the proofs you actually have on record."
              },
              {
                icon: Zap,
                title: "Instant Results",
                desc: "No waiting for days. Get a comprehensive PDF report instantly after answering."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-none shadow-xl shadow-slate-200/50 bg-gradient-to-br from-white to-slate-50 hover:shadow-2xl transition-all duration-300 group">
                  <div className="p-8">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute -top-[50%] -right-[20%] w-[500px] h-[500px] bg-accent/30 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to file with confidence?</h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                Join 10,000+ taxpayers who use our tool to verify their returns before submission.
              </p>
              <Link href="/wizard">
                <Button size="lg" variant="accent" className="text-lg h-14 px-8 rounded-full">
                  Start Your Check Now
                </Button>
              </Link>
              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-primary-foreground/60">
                <CheckCircle2 className="w-4 h-4" />
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <CheckCircle2 className="w-4 h-4" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
