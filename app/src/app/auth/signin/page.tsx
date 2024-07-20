"use client";
import { useState } from "react";
import { SignIn } from "@/actions/auth/signin";
import { displayErrorToast } from "@/lib/helpers/apiRequestHelpers";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FullscreenSpinner } from "@/components/ui/loading";

export default function () {
  const router = useRouter();
  const {toast} = useToast()
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  async function handleSignIn() {
    setLoading(true);
    const res = await SignIn(username, password);
    setLoading(false);
    if(res.success) {
      router.push("/home/0");
    } else {
      displayErrorToast(toast, res.message!);
    }
  }

  if(loading) {
    return <FullscreenSpinner />
  }
  return (
    <>
      <div className="flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your username below to login to your account
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">username</Label>
              <Input
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                required
                type="text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                required
                type="password"
              />
            </div>
            <Button onClick={handleSignIn} className="w-full">Sign In</Button>
          </div>
          <div className="text-center text-sm">
            Don't have an account?
            <Link className="underline" href="/auth/signup">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
