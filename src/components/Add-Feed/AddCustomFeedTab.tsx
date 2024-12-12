import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FieldApi, useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { Button } from "../ui/button";
import { User } from "@/types/user";
import useFeedMutations from "@/hooks/useFeedMutations";
import { useToast } from "@/hooks/use-toast";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorResponse } from "@/types/errors";

type FieldInfoProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: FieldApi<any, any, any, any>;
};
export function FieldInfo({ field }: FieldInfoProps) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className="text-red-600 mt-2 text-sm">
          {field.state.meta.errors.join(", ")}
        </p>
      ) : null}
    </>
  );
}

function AddCustomFeedTab({ user }: { user: User }) {
  const { createFeedMutation } = useFeedMutations();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      feedTitle: "",
      feedURL: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      // await createFeedMutation.mutateAsync({
      //   userId: user.id,
      //   payload: { url: value.feedURL, title: value.feedTitle },
      // });

      toast({
        title: "Success!",
        variant: "default",
        description: `"${value.feedTitle}" has been added to your feeds.`,
        duration: 5000,
      });
      value.feedTitle = "";
      value.feedURL = "";
    },
    //on initial load the form is empty, runs this if user trys to submit
    onSubmitInvalid: (props) => {
      if (
        props.value.feedTitle.length === 0 ||
        props.value.feedURL.length === 0
      ) {
        toast({
          title: "Uh oh! Your form is empty!",
          variant: "destructive",
          description: "One or more fields are required.",
          duration: 5000,
        });
      }
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmitAsync: async (obj) => {
        try {
          await createFeedMutation.mutateAsync({
            userId: user.id,
            payload: {
              url: obj.value.feedURL,
              title: obj.value.feedTitle,
              category: [],
            },
          });

          return;
        } catch (error) {
          if (error instanceof AxiosError) {
            const status = error.status;
            const errorResponse =
              error.response as AxiosResponse<ErrorResponse>;
            const errorMessage = errorResponse.data?.errors[0]?.message || "";

            if (status === 400) {
              return {
                form: "field error",
                fields: {
                  feedURL: errorMessage,
                },
              };
            }
            return {
              form: "Invalid Data",
              fields: {
                feedURL: errorResponse.statusText,
              },
            };
          } else {
            return {
              form: "Invalid Data",
              fields: {
                feedURL:
                  "An unexpected error occured!, Please try again later.",
              },
            };
          }
        }
      },
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className="mt-4">
          <form.Field
            name="feedTitle"
            validators={{
              onBlur: z
                .string()
                .min(3, {
                  message: "Feed Title must be at least 3 characters long",
                })
                .max(16, {
                  message:
                    "Feed Title must be between 3 and 16 characters long",
                }),
            }}
            children={(field) => {
              return (
                <>
                  <Label>Feed Title</Label>
                  <Input
                    type="text"
                    className="mt-1"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldInfo field={field}></FieldInfo>
                </>
              );
            }}
          />
        </div>
        <div className="mt-4">
          <form.Field
            name="feedURL"
            validators={{
              onBlur: z
                .string()
                .url({ message: "Invalid URL" })
                .regex(/^https/i, {
                  message: "Feed URL must be in an HTTPS format",
                }),
            }}
            children={(field) => {
              return (
                <>
                  <Label>Feed URL</Label>
                  <Input
                    type="url"
                    className="mt-1"
                    placeholder="e.g https://www.nature.com/nature.rss"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <FieldInfo field={field}></FieldInfo>
                </>
              );
            }}
          />
        </div>
        <div className="mt-6">
          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.isPristine,
            ]}
            children={([canSubmit, isSubmitting, isPristine]) => (
              <Button
                type="submit"
                disabled={
                  !canSubmit || createFeedMutation.isPending || isPristine
                }
                aria-disabled={!canSubmit || createFeedMutation.isPending}
              >
                {isSubmitting ? "...." : "Submit"}
              </Button>
            )}
          />
        </div>
      </form>
    </>
  );
}
export default AddCustomFeedTab;
