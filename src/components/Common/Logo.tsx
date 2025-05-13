"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Url } from "url";

interface LogoProps {
  width?: number;
  height?: number;
  showBrandName?: boolean;
  link?: string;
  target?: string;
}

const Logo = ({
  width = 30,
  height = 30,
  showBrandName = true,
  link,
  target,
}: LogoProps) => {
  const pathname = usePathname();
  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => {
      window.removeEventListener("scroll", handleStickyNavbar);
    };
  }, []);

  return link ? (
    <Link
      href={link}
        {...(target && { target })}
        className="flex items-center"
      >
        <Image
          src="/images/logo/logo.png"
          alt="logo"
          width={width}
          height={height}
          className="hidden dark:block"
        />
        <Image
          src="/images/logo/logo-white.png"
          alt="logo"
          width={width}
          height={height}
          className="dark:hidden"
        />
        {showBrandName && (
          <span className="ml-2 text-xl font-bold text-black dark:text-white">
            Knowtix
          </span>
        )}
      </Link>
    ) : (
      <div className="flex items-center">
        <Image
          src="/images/logo/logo.png"
          alt="logo"
          width={width}
          height={height}
          className="hidden dark:block"
        />
        <Image
          src="/images/logo/logo-white.png"
          alt="logo"
          width={width}
          height={height}
          className="dark:hidden"
        />
        {showBrandName && (
          <span className="ml-2 text-xl font-bold text-black dark:text-white">
            Knowtix
          </span>
        )}
      </div>
  );
};

export default Logo;
