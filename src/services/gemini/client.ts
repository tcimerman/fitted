// Gemini REST client: key handling, retries with backoff, error taxonomy.
// Plain fetch against generativelanguage.googleapis.com — no SDK needed.

const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export const MODELS = {
  reasoning: 'gemini-2.5-flash',
  image: 'gemini-2.5-flash-image',
} as const;

export class GeminiError extends Error {
  constructor(message: string, public friendly: string) {
    super(message);
  }
}
export class MissingKeyError extends GeminiError {
  constructor() {
    super('Gemini API key not configured', 'ai is napping — add a gemini key in .env to wake it up');
  }
}
export class RateLimitError extends GeminiError {
  constructor() {
    super('Rate limited', 'whoa, too fast — give the ai a sec and try again');
  }
}
export class SafetyBlockedError extends GeminiError {
  constructor() {
    super('Blocked by safety filters', "couldn't render that one — let's try a different combo");
  }
}
export class BadResponseError extends GeminiError {
  constructor(detail: string) {
    super(`Bad response: ${detail}`, 'the ai got confused — tap to try again');
  }
}
export class NetworkError extends GeminiError {
  constructor() {
    super('Network failure', "can't reach the ai — check your connection");
  }
}

export function isConfigured(): boolean {
  return !!process.env.EXPO_PUBLIC_GEMINI_API_KEY;
}

export function friendlyError(e: unknown): string {
  if (e instanceof GeminiError) return e.friendly;
  return 'something went sideways — try again';
}

export interface InlinePart {
  inlineData: { mimeType: string; data: string };
}
export interface TextPart {
  text: string;
}
export type Part = InlinePart | TextPart;

interface GenerateOptions {
  model: string;
  parts: Part[];
  responseSchema?: object;
  responseModalities?: ('TEXT' | 'IMAGE')[];
  temperature?: number;
  timeoutMs?: number;
}

interface GeminiResponse {
  candidates?: {
    content?: { parts?: { text?: string; inlineData?: { mimeType: string; data: string } }[] };
    finishReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function generateContent(opts: GenerateOptions): Promise<GeminiResponse> {
  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!key) throw new MissingKeyError();

  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: opts.parts }],
  };
  const generationConfig: Record<string, unknown> = {};
  if (opts.responseSchema) {
    generationConfig.responseMimeType = 'application/json';
    generationConfig.responseSchema = opts.responseSchema;
  }
  if (opts.responseModalities) generationConfig.responseModalities = opts.responseModalities;
  if (opts.temperature != null) generationConfig.temperature = opts.temperature;
  if (Object.keys(generationConfig).length) body.generationConfig = generationConfig;

  const url = `${BASE}/${opts.model}:generateContent`;
  let lastError: GeminiError = new NetworkError();

  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await sleep(1000 * 2 ** (attempt - 1));
    let res: Response;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 60_000);
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);
    } catch {
      lastError = new NetworkError();
      continue;
    }
    if (res.status === 429) {
      lastError = new RateLimitError();
      continue;
    }
    if (res.status >= 500) {
      lastError = new BadResponseError(`server ${res.status}`);
      continue;
    }
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new BadResponseError(`HTTP ${res.status}: ${text.slice(0, 300)}`);
    }
    const json = (await res.json()) as GeminiResponse;
    if (json.promptFeedback?.blockReason) throw new SafetyBlockedError();
    const finish = json.candidates?.[0]?.finishReason;
    if (finish === 'SAFETY' || finish === 'IMAGE_SAFETY' || finish === 'PROHIBITED_CONTENT') throw new SafetyBlockedError();
    return json;
  }
  throw lastError;
}

/** Extract the text payload (JSON mode) from a response. */
export function extractText(res: GeminiResponse): string {
  const text = res.candidates?.[0]?.content?.parts?.find((p) => p.text)?.text;
  if (!text) throw new BadResponseError('no text in response');
  return text;
}

/** Extract the first inline image (base64) from a response. */
export function extractImage(res: GeminiResponse): string {
  const img = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData;
  if (!img) throw new BadResponseError('no image in response');
  return img.data;
}

export function parseJson<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    // tolerate accidental markdown fences
    const m = text.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]) as T;
      } catch {}
    }
    throw new BadResponseError('unparseable JSON');
  }
}
