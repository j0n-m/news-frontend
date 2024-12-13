import { FeedItem } from "@/types/feed";
import { ArrowLeftIcon, Bookmark } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useEffect, useState } from "react";
import useArticleMutations from "@/hooks/useArticleMutations";
import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import fetch from "@/utils/fetch";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import moment from "moment";
import { Separator } from "../ui/separator";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet-async";

type FeedDetailsProps = {
  feedItem: FeedItem;
  feedId: string;
  feedTitle: string;
};

function FeedDetails({ feedItem, feedId, feedTitle }: FeedDetailsProps) {
  const [isArticleSaved, setIsArticleSaved] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const sanitizedHTML = DOMPurify.sanitize(feedItem?.content || "", {
    ALLOWED_ATTR: ["src", "href", "sizes", "class"],
    FORBID_TAGS: ["nav"],
  });

  const savedArticleQuery = useQuery({
    queryKey: ["userSavedArticle", feedItem.url_id],
    queryFn: () =>
      fetch.get(
        `/api/user/${user?.id}/saved-feed-items?src_link=${feedItem.source_link}`
      ),
    enabled: !!user,
    staleTime: Infinity,
  });
  const { saveArticleMutate, removeArticleMutate } = useArticleMutations();

  const hasImg = feedItem?.content?.includes("<img");

  const decideArticleAction = () => {
    if (isArticleSaved) {
      //remove article from saved
      if (user) {
        console.log("removing article...");
        removeArticleMutate.mutate(
          {
            userId: user.id,
            feedItemId: savedArticleQuery.data?.data?.saved_feed_items[0]?._id,
          },
          {
            onSuccess: () => {
              return toast({
                title: "Article removed from favorites",
                variant: "default",
                duration: 3000,
              });
            },
            onError: () => {
              setIsArticleSaved(true);
            },
          }
        );
      }
    } else {
      //save article to be saved
      if (user) {
        console.log("saving article...", feedTitle);
        saveArticleMutate.mutate(
          {
            data: feedItem,
            userId: user?.id || "",
            feedId,
            feedTitle,
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
              setIsArticleSaved(false);
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
  useEffect(() => {
    if (savedArticleQuery.data?.data?.saved_feed_items.length) {
      setIsArticleSaved(true);
    }
  }, [savedArticleQuery.isSuccess]);

  return (
    <>
      <Helmet>
        <title>News RSS - {feedItem?.title || feedTitle}</title>
      </Helmet>
      <div className="mb-4 flex items-center">
        <Button
          variant="outline"
          className="flex gap-1 items-center"
          onClick={() => window.history.back()}
          title="Back"
        >
          <ArrowLeftIcon size={20} />
          <span>Back</span>
        </Button>

        {savedArticleQuery.data && (
          <Toggle
            variant="outline"
            className="ml-auto group"
            title={isArticleSaved ? "Remove from saved" : "Save this article"}
            size={"sm"}
            pressed={isArticleSaved}
            onPressedChange={setIsArticleSaved}
            onClick={decideArticleAction}
            disabled={
              saveArticleMutate.isPending || removeArticleMutate.isPending
            }
          >
            <Bookmark
              // className="group-data-[state=on]:text-gray-500 group-data-[state=on]:fill-gray-500 transition-all duration-500"
              className="group-data-[state=on]:fill-[#FFD700] transition-all duration-500 group-data-[state=on]:scale-110"
              size={20}
              strokeWidth={1.5}
            />
          </Toggle>
        )}
      </div>
      <div className="feed-details">
        <h1 className="text-2xl font-bold mb-2">{feedItem.title}</h1>

        <div className="flex h-5 items-center gap-2 text-sm text-gray-500 mb-1">
          {feedItem?.author && (
            <>
              <div className="">{feedItem.author}</div>
              <Separator className="" orientation="vertical"></Separator>
            </>
          )}
          <div className="">
            {moment(new Date(feedItem.pubDate)).format("lll")}
          </div>
          {feedTitle && (
            <>
              <Separator className="" orientation="vertical"></Separator>
              <div className="">{feedTitle}</div>
            </>
          )}
        </div>
        {!hasImg && (
          <img
            src={feedItem?.image_url}
            loading="lazy"
            role="presentation"
            className="title-img my-4"
          ></img>
        )}
        <div
          className="py-4"
          // dangerouslySetInnerHTML={{ __html: feedItem?.content || "" }}
          dangerouslySetInnerHTML={{
            __html: sanitizedHTML,
          }}
        ></div>
      </div>
      <hr />
      <div className="feed-details-footer p-8">
        <a
          href={feedItem.source_link}
          target="_blank"
          className="block mx-auto text-center p-2 w-full md:max-w-[400px] outline outline-[#E1E4E8]/80 hover:bg-secondary active:bg-secondary focus-visible:outline-blue-700 transition-all duration-300 rounded-md"
        >
          Visit Site
        </a>
      </div>
    </>
  );
}
export default FeedDetails;
