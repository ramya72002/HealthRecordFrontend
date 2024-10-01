'use client'
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AuthLogin = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission
    setIsLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:80/signin", { email });
      if (response.status === 200) {
        router.push("/dashboard"); // Redirect to the dashboard
      }
    } catch (error) {
      setErrorMessage("Invalid email. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSignin}>
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email" />
          </div>
          <TextInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sizing="md"
            className="form-control"
            required
          />
        </div>

        <div className="flex justify-between my-5">
          {/* <div className="flex items-center gap-2">
            <Checkbox id="accept" className="checkbox" />
            <Label
              htmlFor="accept"
              className="opacity-90 font-normal cursor-pointer"
            >
              Remember this Device
            </Label>
          </div> */}
          <Link href="/forgot-password" className="text-primary text-sm font-medium">
            Forgot Email?
          </Link>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}

        <Button type="submit" color="primary" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </>
  );
};

export default AuthLogin;
