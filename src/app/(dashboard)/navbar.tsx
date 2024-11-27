"use client";
import { UserButton } from "@/features/auth/components/user-button"
import { useSession } from "next-auth/react";
import Link from 'next/link';

export const Navbar = () => {
  const session = useSession();

  return (
    <nav className="w-full flex items-center p-4 h-[68px]">
      <div className="ml-auto">
        {
          session?.data != null ?
            <UserButton />
            :
            <Link href="/sign-in">
              Login
            </Link >
        }
      </div>
    </nav>
  );
};
