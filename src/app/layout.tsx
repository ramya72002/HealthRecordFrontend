'use client'
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import 'simplebar-react/dist/simplebar.min.css';
import "./css/globals.css";
import { Flowbite } from "flowbite-react";
import customTheme from "@/utils/theme/custom-theme";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userDetails = localStorage.getItem('userDetails');

    // If user is not logged in, redirect to login page (only if they are on a protected route)
    if (!userDetails && pathname === "/") {
      router.push("/auth/login");
    }

    // If user is logged in, prevent redirecting to /dashboard from authentication pages
    if (userDetails && pathname.startsWith("/auth")) {
      return; // Do nothing, let them stay
    }

    // Redirect authenticated users to dashboard only if they are on the home page "/"
    if (userDetails && pathname === "/") {
      router.push("/dashboard");
    }
  }, [pathname]); // Dependency added to monitor path changes

  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Flowbite theme={{ theme: customTheme }}>
          {children}
        </Flowbite>
      </body>
    </html>
  );
}
