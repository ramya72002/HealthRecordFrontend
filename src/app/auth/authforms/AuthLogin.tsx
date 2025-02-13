'use client'
import { Button, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AuthLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const router = useRouter();

  // Automatically sign in if email is stored in localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      handleSignin();
    }
  }, []);

  const handleSignin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Prevent default form submission if called from the form
    setIsLoading(true);
    try {
      const response = await axios.post("https://health-project-backend-url.vercel.app/login", { email, password });
      if (response.status === 200) {
        const userDetails = JSON.stringify(response.data);
        localStorage.setItem("userDetails", userDetails);
        router.push("/dashboard"); // Redirect to the dashboard
      }
    } catch (error) {
      setErrorMessage("Invalid email or password. Please try again.");
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      alert("Please enter your email.");
      return;
    }
  
    try {
      const response = await axios.post(
        "https://health-project-backend-url.vercel.app/forgot-password",
        { email: forgotPasswordEmail }
      );
  
      if (response.status === 200) {
        alert("Password reset link sent to your email.");
        setIsForgotPasswordModalOpen(false);
      }
    } catch (error) {
      alert(error|| "Failed to send reset link. Try again.");
    }
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
        <div className="mb-4">
          <div className="mb-2 block">
            <Label htmlFor="password" value="Password" />
          </div>
          <TextInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sizing="md"
            className="form-control"
            required
          />
        </div>

        <div className="flex justify-between my-5">
          <button
            type="button"
            onClick={() => setIsForgotPasswordModalOpen(true)}
            className="text-primary text-sm font-medium"
          >
            Forgot Password?
          </button>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}

        <Button type="submit" color="primary" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {/* Simple Forgot Password Modal */}
      {isForgotPasswordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
            <p className="mb-4">Enter your email address to reset your password.</p>
            <input
              type="email"
              placeholder="Email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsForgotPasswordModalOpen(false)}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleForgotPassword}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded hover:bg-primary-dark"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthLogin;