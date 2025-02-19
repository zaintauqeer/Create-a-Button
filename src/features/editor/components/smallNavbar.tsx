"use client";
import { Logo } from "@/features/editor/components/logo";
import Link from "next/link";
import Image from "next/image";
export const SmallNavbar = () => {
  return (
    <nav className="w-full flex items-center p-4 h-[68px] gap-x-7 border-b lg:pl-[34px]">
        <Link href="/">
            <div className="w-36 h-12 relative shrink-0">
                <Image
                    src="/logo.png"
                    fill
                    alt="Image AI"
                    className="shrink-0 hover:opacity-75 transition"
                />
            </div>
        </Link>
        <div className="w-full flex items-center gap-x-1 h-full">
            <div className="ml-auto flex items-center gap-x-4"> </div>
        </div>
    </nav>
  );
};
