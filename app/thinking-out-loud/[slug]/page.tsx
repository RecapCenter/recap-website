import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTABanner } from "@/components/ui/cta-banner";
import { PostBody } from "@/components/thinking-out-loud/post-body";
import { RelatedPosts } from "@/components/thinking-out-loud/related-posts";
import {
  getAllPostSlugs,
  getPostBySlug,
  getPosts,
} from "@/lib/wordpress/posts";
import { JsonLd } from "@/components/seo/json-ld";
import { formatDate, estimateReadingTime } from "@/lib/utils";
import { SITE_URL } from "@/lib/site-url";

const DEFAULT_SHARE_IMAGE = "/og-image.jpg";

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getAllPostSlugs();
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found — Recap" };

  const url = `/thinking-out-loud/${post.slug}`;
  const image = post.featuredImage?.url ?? DEFAULT_SHARE_IMAGE;

  // A page-level openGraph replaces the root layout's entirely, so every
  // field a share card needs is set here.
  return {
    title: `${post.titleText} — Recap`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.titleText,
      description: post.description,
      url,
      siteName: "Recap",
      locale: "en_US",
      publishedTime: post.publishedAtUtc || undefined,
      modifiedTime: post.modifiedAtUtc || undefined,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.titleText,
      description: post.description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = (await getPosts({ perPage: 4 })).data
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const postUrl = `${SITE_URL}/thinking-out-loud/${post.slug}`;

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.titleText,
          description: post.description,
          url: postUrl,
          mainEntityOfPage: postUrl,
          datePublished: post.publishedAtUtc || undefined,
          dateModified: post.modifiedAtUtc || undefined,
          image: post.featuredImage?.url
            ? [post.featuredImage.url]
            : [`${SITE_URL}${DEFAULT_SHARE_IMAGE}`],
          author: { "@type": "Organization", name: "Recap", url: SITE_URL },
          publisher: {
            "@type": "Organization",
            name: "Recap",
            logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
          },
        }}
      />
      <article>
        <div className="px-6 pt-[calc(var(--nav-height)+2.5rem)] pb-6">
          <Link
            href="/thinking-out-loud"
            className="text-body-gray hover:text-ink inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="size-4" />
            Back to Thinking Out Loud
          </Link>
        </div>

        <header className="mx-auto max-w-3xl px-6 pb-8 text-center">
          <SectionHeading as="h1">
            <span dangerouslySetInnerHTML={{ __html: post.title }} />
          </SectionHeading>
          <p className="text-body-gray/70 mt-4 text-sm">
            {formatDate(post.publishedAt)} ·{" "}
            {estimateReadingTime(post.contentHtml)}
          </p>
        </header>

        <PostBody html={post.contentHtml} />
      </article>

      <RelatedPosts posts={relatedPosts} />

      <CTABanner
        eyebrow="stay in the loop"
        heading="Get new posts in your inbox."
        subtext="No spam, just the occasional thing worth reading."
        buttonLabel="Get in touch"
        buttonHref="/contact"
      />
    </main>
  );
}
