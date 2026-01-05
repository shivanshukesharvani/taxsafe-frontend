import { type Submission, type InsertSubmission } from "@shared/schema";

export interface IStorage {
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmission(id: number): Promise<Submission | undefined>;
  updateSubmission(id: number, updates: Partial<Submission>): Promise<Submission>;
}

export class MemStorage implements IStorage {
  private submissions: Map<number, Submission>;
  private currentId: number;

  constructor() {
    this.submissions = new Map();
    this.currentId = 1;
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = this.currentId++;
    const submission: Submission = {
      ...insertSubmission,
      id,
      status: "pending",
      riskLevel: null,
      results: null,
      fileName: null,
      createdAt: new Date(),
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async getSubmission(id: number): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async updateSubmission(id: number, updates: Partial<Submission>): Promise<Submission> {
    const existing = this.submissions.get(id);
    if (!existing) {
      throw new Error(`Submission ${id} not found`);
    }
    const updated = { ...existing, ...updates };
    this.submissions.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
