import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { wordpressConfig } from "@/lib/wordpress/config";
import {
  collectionTag,
  itemTag,
  type WordPressPostType,
} from "@/lib/wordpress/revalidation";

const DETAIL_PATH_PREFIX: Partial<Record<WordPressPostType, string>> = {
  post: "/thinking-out-loud",
};

type RevalidateBody = {
  postType?: WordPressPostType;
  slug?: string;
  action?: "publish" | "update" | "trash" | "delete";
};

export async function POST(request: Request) {
  const secret = request.headers.get("x-recap-revalidate-secret");
  if (!wordpressConfig.revalidateSecret || secret !== wordpressConfig.revalidateSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as RevalidateBody | null;
  if (!body?.postType) {
    return NextResponse.json({ error: "Missing postType" }, { status: 400 });
  }

  const tags = [collectionTag(body.postType)];
  const paths: string[] = [];

  if (body.slug) {
    tags.push(itemTag(body.postType, body.slug));
    const prefix = DETAIL_PATH_PREFIX[body.postType];
    if (prefix) paths.push(`${prefix}/${body.slug}`);
  }

  tags.forEach((tag) => revalidateTag(tag));
  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({ revalidated: true, tags, paths });
}
