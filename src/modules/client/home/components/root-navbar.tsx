"use client";

import LocaleSwitcher from "@/modules/shared/components/LocaleSwitcher";
import { ThemeSwitcher } from "@/theme/theme-switcher";
import { Button } from "@/components/ui/button";
import { OAuthPkceButton } from "@/modules/client/auth/components/auth/oauth-pkce-button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { Activity } from "lucide-react";

const RootNavBarPage = ({
  session,
  isErrorRender = false,
}: {
  session: any | null;
  isErrorRender?: boolean;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  console.log(session);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 text-primary">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-foreground tracking-tight">
                {/* HealthCare */}
                DrGodly
              </span>
            </Link>

            {/* Nav Links */}
            {!isErrorRender && (
              <nav className="hidden md:flex items-center space-x-8">
                <a
                  href="#features"
                  className="text-muted-foreground font-medium hover:text-primary transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-muted-foreground font-medium hover:text-primary transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#testimonials"
                  className="text-muted-foreground font-medium hover:text-primary transition-colors"
                >
                  Testimonials
                </a>
              </nav>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
              <LocaleSwitcher />
              <ThemeSwitcher />
              {!session ? (
                <>
                  <OAuthPkceButton
                    variant="ghost"
                    size="sm"
                    className="font-semibold rounded-full"
                  >
                    Sign In
                  </OAuthPkceButton>
                  <OAuthPkceButton
                    size="sm"
                    className="rounded-full px-6 shadow-md hover:shadow-lg transition-all"
                  >
                    Sign Up
                  </OAuthPkceButton>
                </>
              ) : (
                <Button
                  size="sm"
                  className="rounded-full px-6 shadow-md hover:shadow-lg transition-all"
                  onClick={() => {
                    const url =
                      session?.session?.activeRoleRedirectUrl ?? "/bezs";
                    router.push(url);
                  }}
                >
                  Open App
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default RootNavBarPage;
