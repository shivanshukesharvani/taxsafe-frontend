import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Assuming shadcn progress, otherwise we mock it
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useCreateSubmission } from "@/hooks/use-submissions";

// --- Mock Progress Component if not in attached assets ---
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
      <motion.div 
        className="h-full bg-accent"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.5, ease: "circOut" }}
      />
    </div>
  );
}

const questions = [
  {
    id: "job_switch",
    text: "Did you switch jobs this financial year?",
    description: "Switching jobs often leads to double counting of standard deductions if not handled correctly.",
    options: [
      { value: "yes", label: "Yes, I did" },
      { value: "no", label: "No, same employer" }
    ]
  },
  {
    id: "foreign_income",
    text: "Do you have any foreign assets or income?",
    description: "Includes stocks (like Apple/Google), bank accounts abroad, or consultancy income.",
    options: [
      { value: "yes", label: "Yes, I have foreign assets/income" },
      { value: "no", label: "No foreign income" }
    ]
  },
  {
    id: "hra_claim",
    text: "Are you claiming HRA (House Rent Allowance)?",
    description: "If you live with parents or pay rent > 1L/year, special proofs are needed.",
    options: [
      { value: "yes", label: "Yes, claiming HRA" },
      { value: "no", label: "No HRA claim" }
    ]
  },
  {
    id: "crypto",
    text: "Did you sell any crypto or virtual assets?",
    description: "Losses in crypto cannot be set off against gains from other crypto assets.",
    options: [
      { value: "yes", label: "Yes, traded crypto" },
      { value: "no", label: "No crypto activity" }
    ]
  }
];

export default function Wizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [, setLocation] = useLocation();
  const createSubmission = useCreateSubmission();

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleAnswer = async (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 150);
    } else {
      // Complete
      try {
        const result = await createSubmission.mutateAsync({ answers: newAnswers });
        setLocation(`/upload/${result.id}`);
      } catch (error) {
        console.error("Failed to create submission", error);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 max-w-2xl mx-auto">
      <div className="w-full mb-8">
        <div className="flex justify-between text-sm font-medium text-muted-foreground mb-2">
          <span>Question {step + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% completed</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Card className="w-full border-none shadow-2xl shadow-slate-200/50">
            <div className="p-8 md:p-10">
              {step > 0 && (
                <button 
                  onClick={handleBack}
                  className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
              )}

              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
                {currentQuestion.text}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {currentQuestion.description}
              </p>

              <div className="space-y-4">
                {currentQuestion.options.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswer(option.value)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                      ${answers[currentQuestion.id] === option.value 
                        ? 'border-accent bg-accent/5 shadow-inner' 
                        : 'border-border bg-white hover:border-accent/50 hover:shadow-md'
                      }
                    `}
                  >
                    <span className={`text-lg font-medium ${answers[currentQuestion.id] === option.value ? 'text-accent' : 'text-foreground'}`}>
                      {option.label}
                    </span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                      ${answers[currentQuestion.id] === option.value ? 'border-accent bg-accent' : 'border-muted-foreground/30'}
                    `}>
                      {answers[currentQuestion.id] === option.value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-primary">Safe & Secure.</span> Your data is encrypted and never shared.
        </p>
      </div>
    </div>
  );
}
