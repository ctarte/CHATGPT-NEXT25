// NEXT25 production scaffold. Intentionally disabled until its private production service is connected.
// Keep the export on executable code; a prior scaffold placed it after // on the same line, so TypeScript treated the file as comments only.
export async function POST() {
  return Response.json(
    { status: 'not_configured' },
    { status: 501 }
  );
}
