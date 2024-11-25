import { z } from "zod";

export const FeedItemSchema = z.object({
  content: z.string().optional(),
  image_url: z.string().optional(),
  title: z.string(),
  content_snippet: z.string(),
  pubDate: z.coerce.date(),
  id: z.number(),
  url_id: z.string(),
  source_link: z.string(),
  author: z.string().optional(),
});

export const FeedSchema = z.object({
  feed_title: z.string(),
  feed_link: z.string(),
  feed_description: z.string().optional(),
  items: z.array(FeedItemSchema),
});

export const FeedResponseSchema = z.object({
  data: z.array(FeedSchema).optional(),
  nextStart: z.any(),
});
export const NextStartSchemaBySource = z.object({
  skip: z.number(),
  limit: z.number(),
});
export const FeedResponseBySourceSchema = z.object({
  data: z.array(FeedSchema),
  nextStart: NextStartSchemaBySource,
});

export type FeedResponse = z.infer<typeof FeedResponseSchema>;
export type FeedResponseBySource = z.infer<typeof FeedResponseBySourceSchema>;
export type Feed = z.infer<typeof FeedSchema>;
export type FeedItem = z.infer<typeof FeedItemSchema>;

export const FeedFromSidebarSchema = z.object({
  _id: z.string(),
  url: z.string(),
  title: z.string(),
  is_pinned: z.boolean(),
  category: z.array(z.string()),
  owner: z.string(),
});
export type FeedFromSidebar = z.infer<typeof FeedFromSidebarSchema>;

export const GlobalFeedListSchema = z.array(
  z.object({
    url: z.string(),
    title: z.string(),
    category: z.array(z.string()),
  })
);
export type GlobalFeedList = z.infer<typeof GlobalFeedListSchema>;
