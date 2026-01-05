import { useState, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { useUploadFile } from "@/hooks/use-submissions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadCloud, File, X, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Upload() {
  const [, params] = useRoute("/upload/:id");
  const submissionId = params ? parseInt(params.id) : null;
  const [, setLocation] = useLocation();
  const uploadFile = useUploadFile();
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleContinue = async () => {
    if (!submissionId) return;

    if (file) {
      // If user selected a file, upload it
      try {
        await uploadFile.mutateAsync({ id: submissionId, fileName: file.name });
      } catch (error) {
        console.error("Upload failed", error);
        // Maybe show toast here
      }
    }
    // Navigate to processing regardless (if no file, it's just skipping)
    setLocation(`/processing/${submissionId}`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-primary mb-3">Add supporting documents</h1>
        <p className="text-lg text-muted-foreground">
          Optional. Upload your salary slip or Form 26AS for higher accuracy.
        </p>
      </motion.div>

      <Card className="w-full p-8 border-none shadow-xl shadow-slate-200/50">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
            isDragging ? "border-accent bg-accent/5 scale-[1.02]" : "border-border hover:border-accent/50 hover:bg-slate-50",
            file ? "border-solid border-success/30 bg-success/5" : ""
          )}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInput} 
            className="hidden" 
            accept=".pdf,.png,.jpg,.jpeg"
          />
          
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-blue-50 text-accent flex items-center justify-center mb-4">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <p className="font-medium text-foreground text-lg mb-1">Click or drag file to upload</p>
                <p className="text-sm text-muted-foreground">PDF, PNG, JPG (Max 5MB)</p>
              </motion.div>
            ) : (
              <motion.div 
                key="file"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
                onClick={(e) => e.stopPropagation()} 
              >
                <File className="w-12 h-12 text-success mb-3" />
                <p className="font-semibold text-lg text-primary mb-1">{file.name}</p>
                <p className="text-sm text-muted-foreground mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleContinue}
            size="lg"
            className="w-full sm:w-auto text-lg px-8 gap-2"
            disabled={uploadFile.isPending}
          >
            {uploadFile.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                {file ? "Upload & Continue" : "Skip for now"}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
