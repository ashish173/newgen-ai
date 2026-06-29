export function json(data: any, init?: number | ResponseInit): Response {
  const status = typeof init === 'number' ? init : (init as ResponseInit | undefined)?.status || 200;
  const headers = new Headers(typeof init === 'number' ? undefined : (init as ResponseInit | undefined)?.headers);
  headers.set('content-type', 'application/json');
  return new Response(JSON.stringify(data), { status, headers });
}

export function badRequest(message: string) {
  return json({ error: message }, 400);
}

export function unauthorized() {
  return json({ error: 'Unauthorized' }, 401);
}

export function forbidden() {
  return json({ error: 'Forbidden' }, 403);
}

export function notFound() {
  return json({ error: 'Not found' }, 404);
}

export function serverError(err: unknown) {
  const message = err instanceof Error ? err.message : 'Internal error';
  return json({ error: message }, 500);
}
