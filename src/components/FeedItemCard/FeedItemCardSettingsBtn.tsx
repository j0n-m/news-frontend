import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookmarkIcon, EllipsisIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Feed, SavedFeedItem } from "@/types/feed";
import useArticleMutations from "@/hooks/useArticleMutations";
import { useContext } from "react";
import { UserAuthContext } from "@/context/userAuthContext";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { Link } from "@tanstack/react-router";

type FeedItemCardSettingsBtnProps = {
  webLink: string;
  favoritesMap?: Map<string, SavedFeedItem>;
  feed: Feed;
  feedItemIndex: number;
};
function FeedItemCardSettingsBtn({
  webLink,
  favoritesMap,
  feed,
  feedItemIndex,
}: FeedItemCardSettingsBtnProps) {
  const { user } = useContext(UserAuthContext);
  const { saveArticleMutate, removeArticleMutate } = useArticleMutations();
  const { toast } = useToast();

  const article = favoritesMap?.get(webLink);

  const decideArticleAction = () => {
    if (article) {
      //remove article from saved
      if (user) {
        console.log("removing article...");
        removeArticleMutate.mutate(
          {
            userId: user.id,
            feedItemId: article._id,
          },
          {
            onSuccess: () => {
              return toast({
                title: "Article removed from favorites",
                variant: "default",
                duration: 3000,
              });
            },
            onError: () => {},
          }
        );
      }
    } else {
      //save article to be saved
      if (user) {
        console.log("saving article...");
        //enables query to get article info by source link

        saveArticleMutate.mutate(
          {
            data: feed.items[feedItemIndex],
            userId: user.id,
            feedId: feed.id,
            feedTitle: feed.feed_title,
          },
          {
            onSuccess: () => {
              return toast({
                title: "Saved article to favorites",
                variant: "default",
                duration: 3000,
                action: (
                  <ToastAction altText="View Favorites" asChild>
                    <Link to="/subscriptions/favorites">View folder</Link>
                  </ToastAction>
                ),
              });
            },
            onError: () => {
              return toast({
                title: "Uh oh! We cannot save this article",
                description: "An error prevented us from saving your article.",
                variant: "destructive",
                duration: 5000,
              });
            },
          }
        );
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="mr-1 size-7"
          variant={"ghost"}
          title="More"
          aria-label="More Options"
        >
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-1">
        <DropdownMenuItem className="flex" asChild>
          <a href={webLink} target="_blank">
            <ExternalLinkIcon />
            <span>View Website</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex" onClick={decideArticleAction}>
          <BookmarkIcon />
          {article ? (
            <span>Remove from Favorites</span>
          ) : (
            <span>Add to favorites</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default FeedItemCardSettingsBtn;
