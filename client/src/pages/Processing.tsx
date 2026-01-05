import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useProcessSubmission } from "@/hooks/use-submissions";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, ShieldAlert, FileSearch } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  { icon: FileSearch, text: "Analyzing your answers..." },
  { icon: ShieldAlert, text: "Checking for high-risk patterns..." },
  { icon: CheckCircle2, text: "Generating final report..." }
];

export default function Processing() {
  const [, params] = useRoute("/processing/:id");
  const submissionId = params ? parseInt(params.id) : null;
  const [, setLocation] = useLocation();
  const processSubmission = useProcessSubmission();
  
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!submissionId) return;

    // Trigger processing immediately on mount
    processSubmission.mutate(submissionId);

    // Animate through fake steps
    const timers = [
      setTimeout(() => setCurrentStep(1), 1500),
      setTimeout(() => setCurrentStep(2), 3000),
      setTimeout(() => setLocation(`/result/${submissionId}`), 4500)
    ];

    return () => timers.forEach(clearTimeout);
  }, [submissionId]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-10 text-center border-none shadow-2xl shadow-slate-200/50">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
          <motion.div 
            className="absolute inset-0 border-4 border-accent rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-accent">
            <Loader2 className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-primary mb-8">Analyzing your profile</h2>

        <div className="space-y-6 text-left max-w-xs mx-auto">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: index <= currentStep ? 1 : 0.3,
                x: 0,
                scale: index === currentStep ? 1.05 : 1
              }}
              className="flex items-center gap-4"
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${index < currentStep ? 'bg-success text-white' : ''}
                ${index === currentStep ? 'bg-accent text-white shadow-lg shadow-accent/30' : ''}
                ${index > currentStep ? 'bg-slate-100 text-slate-400' : ''}
                transition-all duration-500
              `}>
                {index < currentStep ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
              </div>
              <span className={`
                font-medium text-sm
                ${index === currentStep ? 'text-foreground' : 'text-muted-foreground'}
              `}>
                {step.text}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
