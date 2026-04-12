"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function LangingPageCTA({ session }: { session: any | null }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2.5rem] overflow-hidden bg-primary px-6 py-16 sm:px-16 sm:py-24 text-center shadow-2xl"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg
              className="h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground tracking-tight">
              Ready to Transform Your Practice?
            </h2>
            <p className="mt-6 text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Join thousands of healthcare providers who are already using our
              platform to deliver better patient care.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              {!session ? (
                <>
                  <Link href="/signup">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full sm:w-auto rounded-full px-8 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto rounded-full px-8 h-14 text-lg bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      Contact Sales
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/app">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto rounded-full px-8 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Open Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default LangingPageCTA;
