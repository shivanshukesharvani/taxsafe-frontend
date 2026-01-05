import { useRoute } from "wouter";
import { useSubmission } from "@/hooks/use-submissions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { Download, AlertTriangle, AlertCircle, CheckCircle, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Assuming this exists or mocked simply

// Simple Mock Accordion if needed, but since we have Radix in package.json, we assume shadcn-like usage
// Re-implementing simplified accordion parts for robustness if file is missing in generation context
// But per prompt, "shadcn UI components" exist in client/src/components/ui/accordion.tsx? 
// The ls command showed accordion.tsx exists! Perfect.

export default function Result() {
  const [, params] = useRoute("/result/:id");
  const submissionId = params ? parseInt(params.id) : null;
  const { data: submission, isLoading } = useSubmission(submissionId);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!submission || !submission.results) return <div>Not found</div>;

  const { riskLevel, results } = submission;
  const score = results.score || 85;
  const issues = results.issues || [];

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-success bg-success/10 border-success/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'medium': return <AlertCircle className="w-5 h-5 text-warning" />;
      default: return <CheckCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center md:text-left md:flex justify-between items-end"
        >
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Analysis Report</h1>
            <p className="text-muted-foreground">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <Button className="mt-4 md:mt-0 gap-2 shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" />
            Download PDF Report
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Score Card */}
          <Card className="md:col-span-1 p-6 flex flex-col items-center justify-center text-center shadow-lg border-none bg-white relative overflow-hidden">
             {/* Background gradient for score */}
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-destructive via-warning to-success"></div>
             
             <div className="relative w-32 h-32 flex items-center justify-center mb-4">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                 <motion.circle 
                   initial={{ strokeDasharray: "339.292", strokeDashoffset: "339.292" }}
                   animate={{ strokeDashoffset: 339.292 - (339.292 * score) / 100 }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   cx="60" cy="60" r="54" 
                   stroke="currentColor" 
                   strokeWidth="12" 
                   fill="transparent" 
                   className={score > 80 ? "text-success" : score > 50 ? "text-warning" : "text-destructive"}
                   strokeLinecap="round"
                 />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-3xl font-bold text-primary">{score}</span>
                 <span className="text-xs uppercase font-bold text-muted-foreground">Score</span>
               </div>
             </div>
             
             <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getRiskColor(riskLevel || 'low')}`}>
               {riskLevel?.toUpperCase()} RISK
             </div>
          </Card>

          {/* Summary Card */}
          <Card className="md:col-span-2 p-8 shadow-sm border-none bg-white flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-4">Executive Summary</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Based on your inputs, your tax profile shows <span className="font-semibold text-foreground">{issues.length} potential issues</span> that could trigger scrutiny. 
              {riskLevel === 'high' 
                ? " Immediate attention is recommended before filing." 
                : " Review the flagged items to ensure you have proper documentation."}
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50">
                <div className="text-2xl font-bold text-primary">{issues.filter(i => i.severity === 'high').length}</div>
                <div className="text-xs font-semibold text-destructive uppercase mt-1">Critical</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50">
                <div className="text-2xl font-bold text-primary">{issues.filter(i => i.severity === 'medium').length}</div>
                <div className="text-xs font-semibold text-warning uppercase mt-1">Warnings</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50">
                <div className="text-2xl font-bold text-primary">{issues.filter(i => i.severity === 'low').length}</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase mt-1">Info</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Issues */}
        <h2 className="text-2xl font-bold mb-6">Detailed Findings</h2>
        <div className="space-y-4">
          {issues.map((issue: any, index: number) => (
            <motion.div
              key={issue.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border border-slate-100 shadow-md hover:shadow-lg transition-shadow">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50/50">
                      <div className="flex items-center gap-4 text-left">
                        <div className="shrink-0">{getSeverityIcon(issue.severity)}</div>
                        <div>
                          <h4 className="font-semibold text-primary text-lg">{issue.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1 md:line-clamp-none">{issue.description}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-2 bg-slate-50/30">
                      <div className="pl-9 text-base text-muted-foreground">
                        <p className="mb-4">
                          <strong>Why this matters:</strong> This pattern is often flagged by the automated risk engine because inconsistencies in this area have historically led to under-reporting of income.
                        </p>
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                          <h5 className="font-semibold text-accent mb-1 text-sm">Recommended Action</h5>
                          <p className="text-sm text-primary/80">
                             Ensure you have bank statements and form 16A matching this declaration. If you are unsure, consult a tax professional.
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
