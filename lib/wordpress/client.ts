import { wordpressConfig } from "./config";

const FETCH_TIMEOUT_MS = 8000;

export type Paginated<T> = {
  data: T;
  total: number;
  totalPages: number;
};

export class WordPressApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "WordPressApiError";
  }
}

type WpFetchOptions = {
  params?: Record<string, string | number | boolean | undefined>;
  tags?: string[];
  init?: RequestInit;
};

export async function wpFetch<T>(
  path: string,
  { params, tags, init }: WpFetchOptions = {},
): Promise<Paginated<T>> {
  const apiUrl = wordpressConfig.apiUrl;
  if (!apiUrl) {
    throw new WordPressApiError("WORDPRESS_API_URL is not configured");
  }

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) query.set(key, String(value));
  }
  const queryString = query.toString();
  const url = `${apiUrl}${path}${queryString ? `?${queryString}` : ""}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "force-cache",
      next: { tags },
    });

    if (!response.ok) {
      throw new WordPressApiError(
        `WordPress API responded with ${response.status} for ${path}`,
        response.status,
      );
    }

    const data = (await response.json()) as T;
    const total = Number(response.headers.get("X-WP-Total") ?? "0");
    const totalPages = Number(response.headers.get("X-WP-TotalPages") ?? "0");

    return { data, total, totalPages };
  } catch (error) {
    if (error instanceof WordPressApiError) throw error;
    throw new WordPressApiError(
      error instanceof Error ? error.message : "Unknown WordPress fetch error",
    );
  } finally {
    clearTimeout(timeout);
  }
}
