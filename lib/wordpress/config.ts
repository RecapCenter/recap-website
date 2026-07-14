function getWordpressApiUrl(): string | null {
  const url = process.env.WORDPRESS_API_URL;
  if (!url) {
    console.warn(
      "WORDPRESS_API_URL is not set — WordPress-backed content will render empty.",
    );
    return null;
  }
  return url.replace(/\/$/, "");
}

export const wordpressConfig = {
  get apiUrl() {
    return getWordpressApiUrl();
  },
  get revalidateSecret() {
    return process.env.WORDPRESS_REVALIDATE_SECRET ?? null;
  },
};
