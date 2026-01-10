import { z } from "zod";

// ✅ DUMMY SCHEMA TO PREVENT WIZARD CRASHES
// If the frontend imports 'insertSubmissionSchema' and tries to .parse(),
// this ensures it succeeds without error.
export const insertSubmissionSchema = z.object({
  // Allow any keys to pass through for the demo
}).passthrough();

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
