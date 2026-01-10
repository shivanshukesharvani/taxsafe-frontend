// 🔧 SAFE API CONFIGURATION
// Exporting a safe string to prevent import crashes, but logic is mocked below.
export const API_URL = "https://taxsafe-breub7gvavf3fhaa.centralindia-01.azurewebsites.net";

export interface AnalyzeResponse {
  success: boolean;
  data?: any;
  message?: string;
}

// 🛑 MOCK DELAY HELPER
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * MOCK: Analyze Test
 */
export async function analyzeTest(): Promise<AnalyzeResponse> {
  await delay(500);
  return { success: true, data: { message: "Mock analysis complete" } };
}

/**
 * MOCK: Create Submission
 * Always returns success to allow Wizard to proceed.
 */
export async function createSubmission(submissionData: any): Promise<AnalyzeResponse> {
  console.log("📝 Mock createSubmission:", submissionData);
  await delay(800);
  return { success: true, data: { id: 123, status: "created" } };
}

/**
 * MOCK: Upload Salary Slip
 */
export async function uploadSalarySlip(id: string | number, file: File): Promise<AnalyzeResponse> {
  console.log("Cc Mock uploadSalarySlip:", id, file.name);
  await delay(1500);
  return { success: true, data: { message: "File uploaded successfully" } };
}

/**
 * MOCK: Process Submission
 */
export async function processSubmission(id: string | number): Promise<AnalyzeResponse> {
  console.log("⚙️ Mock processSubmission:", id);
  await delay(2000);
  return {
    success: true,
    data: {
      reportUrl: "#",
      issues: [
        { title: "HRA Mismatch", description: "Claimed HRA differs from slip." },
        { title: "80C Limit", description: "Investment proof missing for 20k." }
      ]
    }
  };
}

/**
 * MOCK: Get Submission
 */
export async function getSubmission(id: string | number): Promise<AnalyzeResponse> {
  await delay(500);
  return { success: true, data: { id, status: "processed" } };
}
