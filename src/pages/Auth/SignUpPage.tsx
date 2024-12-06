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
import { useToast } from "@/hooks/use-toast";
import useSignUp from "@/hooks/useSignUp";
import { ErrorResponse } from "@/types/errors";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";

function SignUpPage() {
  const { signUpMutate } = useSignUp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
    },
    onSubmit: async () => {},
    validatorAdapter: zodValidator(),
    validators: {
      onSubmitAsync: async (form) => {
        try {
          await signUpMutate.mutateAsync(
            {
              email: form.value.email,
              password: form.value.password,
              first_name: form.value.first_name,
              last_name: form.value.last_name,
            },
            {
              onSuccess: async () => {
                await navigate({ to: "/signin", replace: true });
                return toast({
                  title: "Successfully created your account",
                  variant: "default",
                  description: "Please sign in to continue.",
                  duration: 5000,
                });
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
            console.log(errorResponse);

            if (status === 400 && /first/i.test(errorMessage)) {
              return {
                form: "field error",
                fields: {
                  first_name: errorMessage,
                },
              };
            } else if (status === 400 && /last/i.test(errorMessage)) {
              return {
                form: "field error",
                fields: {
                  last_name: errorMessage,
                },
              };
            } else if (status === 400 && /email/i.test(errorMessage)) {
              return {
                form: "field error",
                fields: {
                  email: errorMessage,
                },
              };
            } else if (status == 400) {
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
  return (
    <div>
      <Card className="max-w-[350px] mx-auto">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="signup-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div>
              <form.Field
                name="first_name"
                validators={{
                  onBlur: z.string().min(3, {
                    message: "First name must be at least 3 characters",
                  }),
                }}
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        className="mt-1"
                        name="firstName"
                        type="text"
                        placeholder="Joe"
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
                name="last_name"
                validators={{
                  onBlur: z.string().min(3, {
                    message: "Last name must be at least 3 characters",
                  }),
                }}
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        className="mt-1"
                        name="lastName"
                        type="text"
                        placeholder="Bob"
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
                        id="emailInput"
                        type="text"
                        placeholder="example@email.com"
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
                        id="passInput"
                        type="password"
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
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.values.first_name,
            ]}
            children={([canSubmit, isSubmitting, firstName]) => (
              <Button
                form="signup-form"
                type="submit"
                className="w-full"
                disabled={
                  !canSubmit ||
                  !!isSubmitting ||
                  signUpMutate.isPending ||
                  signUpMutate.isSuccess
                }
                aria-disabled={!canSubmit || signUpMutate.isPending}
              >
                {isSubmitting ? `Creating ${firstName}...` : "Create account"}
              </Button>
            )}
          />
        </CardFooter>
      </Card>
      <br />
      <div className="max-w-[400px] mx-auto">
        <p className="text-center">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-500 hover:underline focus-visible:underline underline-offset-2 active:text-blue-600 transition-all duration-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
export default SignUpPage;
