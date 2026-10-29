// const base = 'https://ai-mystery-828e.onrender.com/api/v1';
// async function request<T>(path: string, options?: RequestInit): Promise<T> {
//   const response = await fetch(`${base}${path}`, { ...options, credentials: 'include', headers: { 'Content-Type': 'application/json', ...options?.headers } });
//   const body = await response.json();
//   if (!response.ok || !body.success) throw new Error(body.error?.message ?? 'Something went wrong. Please try again.');
//   return body.data as T;
// }
// export const api = {
//   create: (payload: unknown) => request<{ id: string }>('/mysteries', { method: 'POST', body: JSON.stringify(payload) }),
//   list: () => request<{ cases: any[] }>('/mysteries'),
//   getCase: (id: string) => request<{ mystery: import('./types').CaseFile }>(`/mysteries/${id}`),
//   review: (caseId: string, evidenceId: string) => request<{ evidence: import('./types').Evidence }>(`/mysteries/${caseId}/evidence/${evidenceId}/review`, { method: 'POST' }),
//   notes: (caseId: string) => request<{ notes: import('./types').Note[] }>(`/mysteries/${caseId}/notes`),
//   saveNote: (caseId: string, noteId: string | null, data: unknown) => request<{ note: import('./types').Note }>(`/mysteries/${caseId}/notes${noteId ? `/${noteId}` : ''}`, { method: noteId ? 'PATCH' : 'POST', body: JSON.stringify(data) }),
//   deleteNote: (caseId: string, noteId: string) => request<void>(`/mysteries/${caseId}/notes/${noteId}`, { method: 'DELETE' }),
//   accuse: (caseId: string, suspectId: string) => request<{ mystery: import('./types').CaseFile }>(`/mysteries/${caseId}/accusation`, { method: 'POST', body: JSON.stringify({ suspectId }) })
// };
const base = '/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${base}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  const body = await response.json();

  if (!response.ok || !body.success) {
    throw new Error(
      body.error?.message ?? 'Something went wrong. Please try again.'
    );
  }

  return body.data as T;
}

export const api = {
  create: (payload: unknown) =>
    request<{ id: string }>('/mysteries', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  list: () => request<{ cases: any[] }>('/mysteries'),

  getCase: (id: string) =>
    request<{ mystery: import('./types').CaseFile }>(`/mysteries/${id}`),

  review: (caseId: string, evidenceId: string) =>
    request<{ evidence: import('./types').Evidence }>(
      `/mysteries/${caseId}/evidence/${evidenceId}/review`,
      { method: 'POST' }
    ),

  notes: (caseId: string) =>
    request<{ notes: import('./types').Note[] }>(`/mysteries/${caseId}/notes`),

  saveNote: (caseId: string, noteId: string | null, data: unknown) =>
    request<{ note: import('./types').Note }>(
      `/mysteries/${caseId}/notes${noteId ? `/${noteId}` : ''}`,
      {
        method: noteId ? 'PATCH' : 'POST',
        body: JSON.stringify(data)
      }
    ),

  deleteNote: (caseId: string, noteId: string) =>
    request<void>(`/mysteries/${caseId}/notes/${noteId}`, {
      method: 'DELETE'
    }),

  accuse: (caseId: string, suspectId: string) =>
    request<{ mystery: import('./types').CaseFile }>(
      `/mysteries/${caseId}/accusation`,
      {
        method: 'POST',
        body: JSON.stringify({ suspectId })
      }
    )
};
