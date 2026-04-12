"use client";

import { motion } from "motion/react";

// const SocialIcon = ({
//   href,
//   children,
// }: {
//   href: string;
//   children: React.ReactNode;
// }) => (
//   <a
//     href={href}
//     className="text-muted-foreground hover:text-primary transition-colors"
//   >
//     {children}
//   </a>
// );

const LandingPageFooter = () => {
  return (
    <motion.footer
      className="bg-[var(--color-landing-muted)]/30 border-t border-[var(--color-landing-border)]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <a
              href="#"
              className="flex items-center space-x-2 text-[var(--color-landing-primary)]"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 3C8.82 3 3 8.82 3 16C3 23.18 8.82 29 16 29C23.18 29 29 23.18 29 16C29 8.82 23.18 3 16 3ZM22 17.5H17.5V22H14.5V17.5H10V14.5H14.5V10H17.5V14.5H22V17.5Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-2xl font-bold text-[var(--color-landing-foreground)]">
                Dr. Godly
              </span>
            </a>
            <p className="mt-4 text-[var(--color-landing-muted-foreground)] text-sm">
              The future of intelligent, seamless, and secure healthcare.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-[var(--color-landing-foreground)]">
              Product
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-[var(--color-landing-muted-foreground)] hover:text-[var(--color-landing-primary)]"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--color-landing-muted-foreground)] hover:text-[var(--color-landing-primary)]"
                >
                  For Patients
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--color-landing-muted-foreground)] hover:text-[var(--color-landing-primary)]"
                >
                  For Doctors
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--color-landing-muted-foreground)] hover:text-[var(--color-landing-primary)]"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-[var(--color-landing-foreground)]">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-[var(--color-landing-muted-foreground)] hover:text-[var(--color-landing-primary)]"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--color-landing-muted-foreground)] hover:text-[var(--color-landing-primary)]"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--color-landing-muted-foreground)] hover:text-[var(--color-landing-primary)]"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--color-landing-muted-foreground)] hover:text-[var(--color-landing-primary)]"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-[var(--color-landing-foreground)]">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-[var(--color-landing-muted-foreground)] hover:text-[var(--color-landing-primary)]"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--color-landing-muted-foreground)] hover:text-[var(--color-landing-primary)]"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--color-landing-muted-foreground)] hover:text-[var(--color-landing-primary)]"
                >
                  Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-[var(--color-landing-border)] flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-[var(--color-landing-muted-foreground)]">
            &copy; {new Date().getFullYear()} Dr. Godly. All rights reserved.
          </p>

          {/* <div className="flex space-x-6 mt-4 sm:mt-0 text-[var(--color-landing-primary)]">
            <SocialIcon href="#">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675..." />
              </svg>
            </SocialIcon>
            <SocialIcon href="#">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M16.338 16.338H13.67V12.16..." />
              </svg>
            </SocialIcon>
            <SocialIcon href="#">
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M22 12c0-5.523-4.477-10-10-10..." />
              </svg>
            </SocialIcon>
          </div> */}
        </div>
      </div>
    </motion.footer>
  );
};

export default LandingPageFooter;
