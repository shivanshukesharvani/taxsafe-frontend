import { pgTable, text, serial, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  answers: jsonb("answers").$type<Record<string, string>>().notNull(),
  fileName: text("file_name"),
  status: text("status").notNull().default("pending"), // pending, processing, complete
  riskLevel: text("risk_level"), // low, medium, high
  results: jsonb("results").$type<{
    score: number;
    issues: Array<{
      id: string;
      title: string;
      description: string;
      severity: "low" | "medium" | "high";
    }>;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({ 
  id: true, 
  createdAt: true,
  status: true,
  riskLevel: true,
  results: true 
});

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
