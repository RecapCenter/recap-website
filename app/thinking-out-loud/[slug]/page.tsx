import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EyebrowLabel } from "@/components/ui/eyebrow-label";
import { SectionHeading } from "@/components/ui/section-heading";
import { CTABanner } from "@/components/ui/cta-banner";
import { PostBody } from "@/components/thinking-out-loud/post-body";
import { RelatedPosts } from "@/components/thinking-out-loud/related-posts";
import { getAllPostSlugs, getPostBySlug, getPosts } from "@/lib/wordpress/posts";
import { formatDate, estimateReadingTime } from "@/lib/utils";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found — Recap" };

  return {
    title: `${post.title} — Recap`,
    description: post.excerpt.replace(/<[^>]+>/g, "").trim(),
    openGraph: post.featuredImage
      ? { images: [{ url: post.featuredImage.url }] }
      : undefined,
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

  const relatedPosts = post.categories[0]
    ? (await getPosts({ categorySlug: post.categories[0].slug, perPage: 4 })).data
        .filter((p) => p.slug !== post.slug)
        .slice(0, 3)
    : [];

  return (
    <main>
      <article>
        <div className="px-6 pt-10 pb-6">
          <Link
            href="/thinking-out-loud"
            className="text-body-gray hover:text-ink inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="size-4" />
            Back to Thinking Out Loud
          </Link>
        </div>

        <header className="mx-auto max-w-3xl px-6 pb-8 text-center">
          {post.categories[0] && (
            <EyebrowLabel withDottedLines>
              {post.categories[0].name}
            </EyebrowLabel>
          )}
          <SectionHeading as="h1" className="mt-4">
            <span dangerouslySetInnerHTML={{ __html: post.title }} />
          </SectionHeading>
          <p className="text-body-gray/70 mt-4 text-sm">
            {formatDate(post.publishedAt)} · {estimateReadingTime(post.contentHtml)}
          </p>
        </header>

        {post.featuredImage && (
          <div className="px-6">
            <div className="relative mx-auto aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-3xl">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt}
                fill
                sizes="(min-width: 1024px) 900px, 100vw"
                className="rounded-3xl object-cover"
              />
            </div>
          </div>
        )}

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
