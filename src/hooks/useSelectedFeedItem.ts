import { useContext } from "react";
import { FeedItemDataContext } from "../context/feedItemData";

export default function useSelectedFeedItem() {
  const { feedItemData, setFeedItemData } = useContext(FeedItemDataContext);

  return { feedItemData, setFeedItemData };
}
