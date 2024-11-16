import { createContext, ReactNode, useState } from "react";
import { FeedItem } from "../types/feed";

type FeedItemData = {
  feedItemData: FeedItem | null;
  setFeedItemData: React.Dispatch<React.SetStateAction<FeedItem | null>>;
};

export const FeedItemDataContext = createContext<FeedItemData>({
  feedItemData: null,
  setFeedItemData: () => {},
});

type FeedItemDataProps = {
  children?: ReactNode;
};
export function FeedItemDataContextProvider({ children }: FeedItemDataProps) {
  const [feedItemData, setFeedItemData] = useState<FeedItem | null>(null);

  return (
    <FeedItemDataContext.Provider value={{ feedItemData, setFeedItemData }}>
      {children}
    </FeedItemDataContext.Provider>
  );
}
