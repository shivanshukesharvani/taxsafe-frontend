export const api = {
  submissions: {
    create: {
      method: 'POST' as const,
      path: '/api/submissions',
    },
    get: {
      method: 'GET' as const,
      path: '/api/submissions/:id',
    },
    uploadFile: {
      method: 'POST' as const,
      path: '/api/submissions/:id/upload',
    },
    process: {
      method: 'POST' as const,
      path: '/api/submissions/:id/process',
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
