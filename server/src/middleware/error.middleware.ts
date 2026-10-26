import type { NextFunction, Request, Response } from 'express';
export class HttpError extends Error { constructor(public status: number, message: string, public code = 'REQUEST_FAILED') { super(message); } }
export function notFound(_req: Request, _res: Response, next: NextFunction) { next(new HttpError(404, 'This route does not exist.', 'NOT_FOUND')); }
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  const err = error as Error & { status?: number; code?: string };
  if (error instanceof SyntaxError && 'body' in error) { res.status(400).json({ success: false, error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON.' } }); return; }
  if (error && typeof error === 'object' && 'issues' in error) { res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Please check the supplied information and try again.' } }); return; }
  const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500;
  if (status >= 500) console.error('Request failed:', err.message);
  res.status(status).json({ success: false, error: { code: err.code ?? (status === 500 ? 'INTERNAL_ERROR' : 'REQUEST_FAILED'), message: status === 500 ? 'The request could not be completed. Please try again.' : err.message } });
}
