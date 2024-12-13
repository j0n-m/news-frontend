import { FolderPenIcon, Trash2Icon } from "lucide-react";

import { DropdownMenuItem } from "../ui/dropdown-menu";

import { DropdownMenuContent } from "../ui/dropdown-menu";

import { FolderIcon, MoreHorizontal } from "lucide-react";

import { FeedFromSidebar } from "@/types/feed";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarSeparator,
} from "../ui/sidebar";

import { SidebarMenuItem } from "../ui/sidebar";
import { Link } from "@tanstack/react-router";
import { FolderOpenIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

type SidebarFeedProps = {
  feed: FeedFromSidebar;
  isMobile: boolean;
  handleDelete: (feed: FeedFromSidebar) => void;
  handleRenameFeed: (feedId: string, newFeedTitle: string) => Promise<void>;
  pathName: string;
};
function SidebarFeed({
  feed,
  isMobile,
  handleDelete,
  handleRenameFeed,
  pathName,
}: SidebarFeedProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const renameForm = useForm({
    defaultValues: {
      feedId: feed._id,
      feedTitle: feed.title,
    },
    onSubmit: async () => {
      setIsRenameOpen(false);
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmitAsync: async ({ value }) => {
        //mutate here
        try {
          await handleRenameFeed(value.feedId, value.feedTitle);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          return {
            form: "Invalid data",
            fields: {
              feedTitle: "An unexpected error occured. Please try again later",
            },
          };
        }
      },
    },
  });

  return (
    <>
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent
          className={`${isMobile ? "max-w-[425px]" : "md:max-w-[500px]"}`}
        >
          <DialogHeader>
            <DialogTitle>Rename '{feed.title}'?</DialogTitle>
            <DialogDescription>
              Make changes to the feed name here.
            </DialogDescription>
          </DialogHeader>
          <div>
            <form
              id="rename-form"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                renameForm.handleSubmit();
              }}
            >
              <div>
                <renameForm.Field
                  name="feedTitle"
                  validators={{
                    onChange: z.string().min(3, {
                      message: "Feed Title must be at least 3 characters",
                    }),
                  }}
                  children={(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name}>Feed Title</Label>
                        <Input
                          className="mt-1"
                          placeholder="e.g. Zoo - Reptiles"
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
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
            </form>
          </div>
          <DialogFooter>
            <div>
              <renameForm.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    form="rename-form"
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save changes"}
                  </Button>
                )}
              ></renameForm.Subscribe>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete '{feed.title}'?</DialogTitle>
            <DialogDescription>
              Note: You will still keep all saved articles from this feed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant={"destructive"}
              type="submit"
              onClick={() => handleDelete(feed)}
            >
              Delete this feed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SidebarMenuItem key={feed._id}>
        <SidebarMenuButton
          className=""
          tooltip={feed.title}
          title={feed.title}
          isActive={pathName.includes(feed._id)}
          asChild
        >
          <Link
            to={`/subscriptions/$feedId`}
            params={{ feedId: feed?._id }}
            className=""
          >
            {({ isActive }) => (
              <>
                {isActive ? <FolderOpenIcon /> : <FolderIcon />}
                <span className={`${isActive && "font-semibold"}`}>
                  {feed.title}
                </span>
              </>
            )}
          </Link>
        </SidebarMenuButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction>
              <MoreHorizontal />
              <span className="sr-only">More</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align={isMobile ? "end" : "start"}
          >
            <DropdownMenuItem asChild>
              <Link
                to={`/subscriptions/$feedId`}
                params={{ feedId: feed?._id }}
              >
                <FolderOpenIcon />

                <span>View page</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
              <FolderPenIcon />
              <span>Rename</span>
            </DropdownMenuItem>

            <SidebarSeparator orientation="horizontal"></SidebarSeparator>
            <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
              <Trash2Icon />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </>
  );
}
export default SidebarFeed;
