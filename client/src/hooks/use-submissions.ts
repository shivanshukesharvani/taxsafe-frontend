import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useLocation } from "wouter";
import { z } from "zod";

// Create Submission
export function useCreateSubmission() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: z.infer<typeof api.submissions.create.input>) => {
      const validated = api.submissions.create.input.parse(data);
      const res = await fetch(api.submissions.create.path, {
        method: api.submissions.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.submissions.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create submission');
      }

      return api.submissions.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [api.submissions.get.path, data.id] });
    },
  });
}

// Get Submission
export function useSubmission(id: number | null) {
  return useQuery({
    queryKey: [api.submissions.get.path, id],
    queryFn: async () => {
      if (!id) throw new Error("ID is required");
      const url = buildUrl(api.submissions.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch submission');
      
      return api.submissions.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// Upload File
export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, fileName }: { id: number; fileName: string }) => {
      const url = buildUrl(api.submissions.uploadFile.path, { id });
      const res = await fetch(url, {
        method: api.submissions.uploadFile.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName }),
        credentials: "include",
      });

      if (!res.ok) throw new Error('Failed to upload file');
      return api.submissions.uploadFile.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.submissions.get.path, data.id] });
    },
  });
}

// Process Submission
export function useProcessSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.submissions.process.path, { id });
      const res = await fetch(url, {
        method: api.submissions.process.method,
        credentials: "include",
      });

      if (!res.ok) throw new Error('Failed to process submission');
      return api.submissions.process.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.submissions.get.path, data.id] });
    },
  });
}
