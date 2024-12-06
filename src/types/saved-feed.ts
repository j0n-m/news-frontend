import { z } from "zod";
import { FeedFromSidebarSchema, FeedItemSchema } from "./feed";

export const SavedFeedItemsInfoSchema = z
  .object({
    total_records: z.number(),
    content_length: z.number(),
    page_limit: z.number(),
    next: z.number().nullable(),
  })
  .optional();
export const SavedFeedItemSchema = z.object({
  _id: z.string(),
  feed: FeedFromSidebarSchema.optional(),
  owner: z.string(),
  fallback_feed_title: z.string(),
  date_added: z.coerce.date(),
  data: FeedItemSchema,
});
export type SavedFeedItem = z.infer<typeof SavedFeedItemSchema>;
export const SavedFeedSchema = z.object({
  saved_items_info: z.array(SavedFeedItemsInfoSchema),
  saved_feed_items: z.array(SavedFeedItemSchema),
});
export type SavedFeed = z.infer<typeof SavedFeedSchema>;
