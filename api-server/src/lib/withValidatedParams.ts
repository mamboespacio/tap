// src/lib/api/withValidatedParams.ts
import { ZodSchema } from 'zod';
import { NextResponse } from 'next/server';

type HandlerFn<TParams> = (
  req: Request,
  params: TParams
) => Promise<Response>;

export function withValidatedParams<TParams>(
  schema: ZodSchema<TParams>,
  handler: HandlerFn<TParams>
) {
  return async function (
    req: Request,
    context: { params?: Partial<Record<string, string>> }
  ): Promise<Response> {
    const parsed = schema.safeParse(context.params);
    if (!parsed.success) {
      console.error('Invalid route params:', parsed.error);
      return NextResponse.json(
        { error: 'Invalid or missing route parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    return handler(req, parsed.data);
  };
}
