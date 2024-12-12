import UserSavedArticlesInfiniteOptions from "@/queries/UserSavedArticlesInfiniteOptions";
import { queryClient } from "@/routes/__root";
import { User } from "@/types/user";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  redirect,
  useLoaderDeps,
  useNavigate,
} from "@tanstack/react-router";
import { AxiosResponse } from "axios";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import SavedFeedItemCard from "@/components/FeedItemCard/SavedFeedItemCard";
import { Input } from "@/components/ui/input";
import NotFoundPage from "@/pages/404/NotFoundPage";
import { FolderHeartIcon, SearchIcon, XIcon } from "lucide-react";
import FeedItemCardSettingsBtn from "@/components/FeedItemCard/FeedItemCardSettingsBtn";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";

export type QuerySearch = {
  q?: string;
};
export const Route = createFileRoute("/_protected/subscriptions/favorites")({
  component: RouteComponent,
  notFoundComponent: () => <NotFoundPage />,
  validateSearch: (search: Record<string, unknown>): QuerySearch => {
    return {
      q: search?.q as string,
    };
  },
  loaderDeps: ({ search }) => {
    return {
      q: search.q,
    };
  },
  loader: async ({ deps: { q } }) => {
    const cachedUser = queryClient.getQueryData(["user"]) as AxiosResponse;
    if (!cachedUser) {
      throw redirect({
        to: "/signin",
      });
    }
    const user = cachedUser.data?.user as User;
    return await queryClient.ensureInfiniteQueryData(
      UserSavedArticlesInfiniteOptions(user.id, q)
    );
  },
});

function RouteComponent() {
  const cachedUser = queryClient.getQueryData(["user"]) as AxiosResponse;
  const query = useLoaderDeps({ from: "/_protected/subscriptions/favorites" });
  const user = cachedUser.data?.user as User;
  const navigate = useNavigate({ from: "/subscriptions/favorites" });
  const { ref, inView } = useInView();
  const savedFeedQuery = useSuspenseInfiniteQuery(
    UserSavedArticlesInfiniteOptions(user.id, query.q)
  );
  // console.log(savedFeedQuery);
  const favoritesMap = new Map();
  savedFeedQuery.data.pages.map((page) => {
    page.saved_feed_items.map((feed) => {
      favoritesMap.set(feed.data.source_link, feed);
    });
  });
  const form = useForm({
    defaultValues: {
      query: query.q || "",
    },
    onSubmit: async () => {},
    validatorAdapter: zodValidator(),
    validators: {
      onSubmitAsync: async (form) => {
        //mutate here
        try {
          if (form.value.query === "") {
            navigate({ to: "/subscriptions/favorites" });
          } else {
            navigate({
              to: "/subscriptions/favorites",
              search: { q: form.value.query },
            });
          }

          return null;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          return {
            form: "Invalid data",
            fields: {
              query: "An unexpected error occured. Please try again later",
            },
          };
        }
      },
    },
  });

  useEffect(() => {
    if (savedFeedQuery.hasNextPage && inView) {
      savedFeedQuery.fetchNextPage();
    }
  }, [inView]);

  return savedFeedQuery.status === "error" ? (
    <div>
      <h1 className="text-2xl font-bold text-center">
        Error retrieving your feed
      </h1>
      <div className="mt-4 flex items-center justify-center">
        <a
          href="/"
          className="bg-sidebar hover:bg-sidebar-accent px-4 py-1 rounded-md"
        >
          Refresh your feed
        </a>
      </div>
    </div>
  ) : (
    <div className="container mx-auto pt-4 relative mb-4">
      <div className="mb-6 relative max-w-[700px] mx-auto">
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div>
              <form.Field
                name="query"
                children={(field) => {
                  return (
                    <>
                      <Input
                        className="group"
                        placeholder="Search in your saved feeds"
                        aria-label="Search in your saved feeds"
                        id={field.name}
                        name={field.name}
                        maxLength={50}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      ></Input>
                      {field.state.value.length > 0 && (
                        <button
                          onClick={() => field.form.reset({ query: "" })}
                          type="button"
                          className={
                            "absolute top-[6px] rounded-full right-14 flex items-center hover:bg-accent p-1 transition-colors duration-200"
                          }
                        >
                          <XIcon size={20} />
                        </button>
                      )}

                      {field.state.meta.errors ? (
                        <div className="mt-2">
                          <em role="alert" className="text-red-600">
                            {field.state.meta.errors.join(", ")}
                          </em>
                        </div>
                      ) : null}
                    </>
                  );
                }}
              />
            </div>
            <div>
              <form.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                  state.isSubmitted,
                ]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    aria-label="Search"
                    disabled={!canSubmit || isSubmitting}
                    variant={`ghost`}
                    className="absolute top-0 right-0 group-focus-within:bg-accent"
                  >
                    <SearchIcon />
                  </Button>
                )}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <h1 className="font-bold text-xl text-[#006AB6] hover:text-[#0080DB] focus-visible:text-[#0080DB] active:text-[#0080DB] transition-colors duration-200 w-max">
          {"Saved Articles"}
        </h1>
        {savedFeedQuery.data?.pages[0]?.saved_items_info[0]?.total_records && (
          <p>
            ({savedFeedQuery.data.pages[0].saved_items_info[0].total_records})
          </p>
        )}
      </div>
      {savedFeedQuery.data.pages.map((page, pageIndex) => {
        return (
          <div className="flex flex-col gap-4 pb-3" key={pageIndex}>
            {page.saved_feed_items.map((savedFeed, i) => {
              return (
                <div className="saved-card" key={savedFeed._id}>
                  <div className="saved-card-settings flex justify-end items-center">
                    {favoritesMap?.get(savedFeed.data.source_link) && (
                      <span title="Article is saved">
                        <FolderHeartIcon className="size-4 mr-2"></FolderHeartIcon>
                      </span>
                    )}

                    <FeedItemCardSettingsBtn
                      webLink={savedFeed.data.source_link}
                      favoritesMap={favoritesMap}
                      feed={favoritesMap.get(savedFeed.data.source_link)}
                      feedItemIndex={i}
                    />
                  </div>
                  <Link
                    key={savedFeed._id}
                    to="/subscriptions/favorites/$page/$arrIndex"
                    search={{ q: query.q }}
                    params={{
                      arrIndex: i.toString(),
                      page: pageIndex.toString(),
                    }}
                    mask={{
                      to: "/subscriptions/favorites",
                      unmaskOnReload: false,
                    }}
                  >
                    <SavedFeedItemCard savedFeedItem={savedFeed} />
                  </Link>
                </div>
              );
            })}
          </div>
        );
      })}
      {savedFeedQuery.data.pages[0].saved_feed_items.length === 0 &&
      query?.q ? (
        <p className="pb-4 italic">
          No saved articles for '<span className="font-bold">{query.q}</span>'.
        </p>
      ) : savedFeedQuery.data.pages[0].saved_feed_items.length === 0 ? (
        <p className="pb-4 italic">You have no saved articles.</p>
      ) : null}
      {savedFeedQuery.hasNextPage && (
        <div ref={ref} className="text-center relative">
          <div className="absolute left-[50%] -bottom-2 size-6 rounded-full bg-transparent border-t-blue-500 border-[4px] animate-[spin_.8s_linear_infinite]"></div>
        </div>
      )}
    </div>
  );
}
