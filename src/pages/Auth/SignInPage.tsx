import { FieldInfo } from "@/components/Add-Feed/AddCustomFeedTab";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSignIn from "@/hooks/useSignIn";
import { Link } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { AxiosError, AxiosResponse } from "axios";
import { ErrorResponse } from "@/types/errors";
import { Helmet } from "react-helmet-async";

function SignInPage() {
  const { signInMutate } = useSignIn();
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: () => {
      //runs after all validation
      //do not put mutations in here
      // console.log("form submitted", form.value);
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmitAsync: async (form) => {
        try {
          await signInMutate.mutateAsync(
            {
              email: form.value.email,
              password: form.value.password,
            },
            {
              onSuccess: () => {
                window.location.replace(redirect || "/home");
              },
            }
          );
          return;
        } catch (error) {
          if (error instanceof AxiosError) {
            const status = error.status;
            const errorResponse =
              error.response as AxiosResponse<ErrorResponse>;
            const errorMessage = errorResponse.data?.errors[0]?.message || "";

            if (status === 400 && errorMessage.includes("email")) {
              return {
                form: "field error",
                fields: {
                  email: errorMessage,
                },
              };
            } else if (status === 400) {
              return {
                form: "field error",
                fields: {
                  password: errorMessage,
                },
              };
            }

            return {
              form: "Invalid Data",
              fields: {
                password: errorResponse.statusText,
              },
            };
          } else {
            return {
              form: "Invalid Data",
              fields: {
                password:
                  "An unexpected error occured!, Please try again later.",
              },
            };
          }
        }
      },
    },
  });

  const handleSignIn = () => {
    signInMutate.mutate(
      { email: "test@email.com", password: "mytestpass" },
      {
        onSuccess: async () => {
          const redirect = new URLSearchParams(window.location.search).get(
            "redirect"
          );
          window.location.replace(redirect || "/home");
        },
      }
    );
  };

  return (
    <div>
      <Helmet>
        <title>News RSS - Sign In</title>
      </Helmet>
      <Card className="max-w-[350px] mx-auto">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="signin-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div>
              <form.Field
                name="email"
                validators={{
                  onBlur: z.string().email({ message: "Invalid email format" }),
                }}
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor="emailInput">Email</Label>
                      <Input
                        className="mt-1"
                        name="emailInput"
                        type="email"
                        placeholder="example@email.com"
                        autoComplete="email"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      ></Input>
                      <FieldInfo field={field} />
                    </>
                  );
                }}
              />
            </div>
            <div className="mt-3">
              <form.Field
                name="password"
                validators={{
                  onBlur: z.string().min(5, {
                    message: "Password must be at least 5 characters",
                  }),
                }}
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor="passInput">Password</Label>
                      <Input
                        className="mt-1"
                        name="passInput"
                        type="password"
                        autoComplete="current-password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      ></Input>
                      <FieldInfo field={field} />
                    </>
                  );
                }}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                form="signin-form"
                type="submit"
                className="w-full"
                disabled={
                  !canSubmit ||
                  isSubmitting ||
                  signInMutate.isPending ||
                  signInMutate.isSuccess
                }
                aria-disabled={!canSubmit || signInMutate.isPending}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            )}
          />
          <Button className="w-full" variant={"outline"} onClick={handleSignIn}>
            Sign In as Test User
          </Button>
        </CardFooter>
      </Card>
      <br />
      <div className="max-w-[400px] mx-auto">
        <p className="text-center">
          Need an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:underline focus-visible:underline underline-offset-2 active:text-blue-600 transition-all duration-300"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
export default SignInPage;
