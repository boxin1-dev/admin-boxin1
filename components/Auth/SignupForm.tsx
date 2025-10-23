"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/src/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "./FormFields";
import { type SignUpFormValues, signUpSchema } from "./schema/signupSchema";

const SignupForm = () => {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      //role: Role.ADMIN,
    },
  });
  const [pending, setPending] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: SignUpFormValues) => {
    console.log("data", data);
    form.reset();

    await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      {
        onRequest: () => {
          setPending(true);
        },
        onSuccess: () => {
          toast({
            title: "Account created",
            description:
              "your account has been created check your email for confirmation",
          });
          console.log("success");
        },
        onError: (ctx) => {
          console.log("error", ctx);
          toast({
            variant: "destructive",
            title: "something went wrong",
            description: ctx.error.message ?? "something went wrong.",
          });
          console.log("error", ctx.error.message);
        },
      }
    );
    setPending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-background/80 p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          {/*
                
                <Logo />
                */}

          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <InputField
                  control={form.control}
                  name="name"
                  label="Full name"
                  placeholder="john doe"
                  type="text"
                  icon={<User className="h-5 w-5 text-muted-foreground" />}
                />

                <InputField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="john.doe@example.com"
                  type="email"
                  icon={<Mail className="h-5 w-5 text-muted-foreground" />}
                />
                {/*
                
                
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Role
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={Role.ADMIN}>
                            Administrator
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                */}

                <InputField
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  icon={<Lock className="h-5 w-5 text-muted-foreground" />}
                  showPasswordToggle={true}
                />

                <InputField
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="••••••••"
                  type="password"
                  icon={<Lock className="h-5 w-5 text-muted-foreground" />}
                  showPasswordToggle={true}
                />

                <Button
                  type="submit"
                  className="w-full text-white bold text-lg"
                  disabled={pending}
                >
                  {pending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Please wait...
                    </>
                  ) : (
                    <>
                      Sign up <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex gap-4 ">
              {/*
                    
                    <GoogleAuthButton
                action="signup"
                buttonText="Sign up with Google"
                redirectTo="/"
              />    

                    */}
            </div>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupForm;
