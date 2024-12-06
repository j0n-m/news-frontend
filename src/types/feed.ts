import { z } from "zod";
import { CategorySchema } from "./categories";

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
  total_items: z.number(),
  id: z.string(),
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
//api/user/feeds
export type FeedFromSidebar = z.infer<typeof FeedFromSidebarSchema>;

export const SingleFeedSchema = z.object({
  user_feed: z.array(FeedFromSidebarSchema),
  rss_data: FeedSchema,
});
export type SingleFeed = z.infer<typeof SingleFeedSchema>;

export const GlobalFeedSchema = z.object({
  _id: z.string(),
  url: z.string(),
  title: z.string(),
  category: z.array(z.string()),
});
export type GlobalFeed = z.infer<typeof GlobalFeedSchema>;

export const GlobalFeedsInfoSchema = z.object({
  total_records: z.number(),
  content_length: z.number(),
  page_limit: z.number(),
  next: z.number().nullable(),
});
export type GlobalFeedsInfo = z.infer<typeof GlobalFeedsInfoSchema>;

export const GlobalFeedsResponseSchema = z.object({
  feeds_info: z.array(GlobalFeedsInfoSchema),
  feeds: z.array(GlobalFeedSchema),
});
export type GlobalFeedsResponse = z.infer<typeof GlobalFeedsResponseSchema>;

export const GlobalFeedByCategoryInfoSchema = z.object({
  total_records: z.number(),
});
export const GlobalFeedByCategoryDataSchema = z.object({
  _id: z.string(),
  feed_count: z.number(),
  feeds: z.array(GlobalFeedSchema),
  category_info: CategorySchema,
});
export const GlobalFeedsByCategoryElementSchema = z.object({
  feeds: z.array(
    z.object({
      feed_info: GlobalFeedByCategoryInfoSchema,
      feed_data: z.array(GlobalFeedByCategoryDataSchema),
    })
  ),
});
export type GlobalFeedsByCategoryResponse = z.infer<
  typeof GlobalFeedsByCategoryElementSchema
>;
