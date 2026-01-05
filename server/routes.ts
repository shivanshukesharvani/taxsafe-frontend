import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.submissions.create.path, async (req, res) => {
    try {
      const input = api.submissions.create.input.parse(req.body);
      const submission = await storage.createSubmission(input);
      res.status(201).json(submission);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.submissions.get.path, async (req, res) => {
    const id = Number(req.params.id);
    const submission = await storage.getSubmission(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.json(submission);
  });

  app.post(api.submissions.uploadFile.path, async (req, res) => {
    const id = Number(req.params.id);
    const { fileName } = req.body;
    
    try {
      const submission = await storage.updateSubmission(id, { fileName });
      res.json(submission);
    } catch (e) {
      res.status(404).json({ message: "Submission not found" });
    }
  });

  app.post(api.submissions.process.path, async (req, res) => {
    const id = Number(req.params.id);
    
    // Mock processing logic
    // In a real app, this would analyze the answers and file
    
    try {
      // Mock results
      const results = {
        score: 75,
        issues: [
          {
            id: "1",
            title: "HRA Claim Mismatch",
            description: "The HRA claimed in your return differs from the amount in Form 16.",
            severity: "high" as const
          },
          {
            id: "2",
            title: "Interest Income Undeclared",
            description: "Savings bank interest seems lower than expected for your income bracket.",
            severity: "medium" as const
          }
        ]
      };

      const submission = await storage.updateSubmission(id, { 
        status: "complete",
        riskLevel: "medium",
        results
      });
      res.json(submission);
    } catch (e) {
      res.status(404).json({ message: "Submission not found" });
    }
  });

  return httpServer;
}
