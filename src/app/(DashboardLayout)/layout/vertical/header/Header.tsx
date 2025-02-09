"use client";
import React, { useState, useEffect } from "react";
import { Badge, Button, Navbar } from "flowbite-react";
import { Icon } from "@iconify/react";
import Profile from "./Profile";
import FullLogo from "../../shared/logo/FullLogo";
import { Drawer } from "flowbite-react";
import MobileSidebar from "../sidebar/MobileSidebar";
import Link from "next/link";
interface User {
  created_at: string;
  email: string;
  id: string;
  name: string;
  user_id: string;
}

interface UserDetails {
  message: string;
  success: boolean;
  user: User;
}

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Retrieve user details from localStorage
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      const parsedDetails: UserDetails = JSON.parse(storedUserDetails);
      setUserDetails(parsedDetails);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Mobile-sidebar
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <header
        className={`sticky top-0 z-[5] ${
          isSticky
            ? "bg-lightgray dark:bg-dark shadow-md fixed w-full"
            : "bg-transparent"
        }`}
      >
        <Navbar
          fluid
          className={`rounded-none bg-transparent dark:bg-transparent py-4 sm:px-30 px-4`}
        >
          {/* Mobile Toggle Icon */}
          <div className="flex gap-3 items-center justify-between w-full">
            <div className="flex gap-2 items-center">
              <span
                onClick={() => setIsOpen(true)}
                className="h-10 w-10 flex text-black dark:text-white text-opacity-65 xl:hidden hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer"
              >
                <Icon icon="solar:hamburger-menu-line-duotone" height={21} />
              </span>
              <span className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer relative">
                <Icon icon="solar:bell-linear" height={20} />
                <Badge className="h-2 w-2 rounded-full absolute end-2 top-1 bg-primary p-0"></Badge>
              </span>
              {/* Display user's name if available */}
              {userDetails && (
                <span className="text-black dark:text-white">
                  Hi {userDetails.user.name}
                </span>
              )}
            </div>

            <div className="flex gap-4 items-center">
              <Profile />
            </div>
          </div>
        </Navbar>
      </header>

      {/* Mobile Sidebar */}
      <Drawer open={isOpen} onClose={handleClose} className="w-130">
        <Drawer.Items>
          <MobileSidebar />
        </Drawer.Items>
      </Drawer>
    </>
  );
};

export default Header;