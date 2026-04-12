"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldCheck, Users } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
    },
  },
};

const floatingIconVariants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

function LandingPageHero({ session }: { session: any | null }) {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden bg-background">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/30 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid lg:grid-cols-2 gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Text Section */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <motion.div variants={itemVariants} className="inline-block mb-4">
              <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                Revolutionizing Healthcare
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1]"
            >
              Your Complete Healthcare Management Platform
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed"
            >
              Streamline patient care, manage appointments, and access medical
              records securely - all in one powerful platform designed for
              modern healthcare providers.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4"
            >
              {!session ? (
                <>
                  <Link href="/signin">
                    <Button
                      size="lg"
                      className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                    >
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/signup">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full px-8 h-12 text-base border-primary/20 hover:bg-primary/5"
                    >
                      Get Started Free
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/app">
                  <Button
                    size="lg"
                    className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                  >
                    Open Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-12 pt-8 border-t border-border/50 flex items-center justify-center lg:justify-start gap-8 text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">10k+ Users</span>
              </div>
            </motion.div>
          </div>

          {/* Visual Section */}
          <motion.div
            variants={itemVariants}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-[600px] mx-auto">
              {/* Main Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute inset-4 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-20"
              >
                <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="h-2 w-20 bg-muted-foreground/10 rounded-full" />
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Activity className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted-foreground/20 rounded" />
                      <div className="h-3 w-24 bg-muted-foreground/10 rounded" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-24 w-full bg-muted/50 rounded-xl border border-border/50" />
                    <div className="flex gap-3">
                      <div className="h-24 w-1/2 bg-muted/50 rounded-xl border border-border/50" />
                      <div className="h-24 w-1/2 bg-muted/50 rounded-xl border border-border/50" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                variants={floatingIconVariants}
                initial="initial"
                animate="animate"
                className="absolute -top-4 -right-4 w-20 h-20 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-border z-30 flex items-center justify-center"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </motion.div>

              <motion.div
                variants={floatingIconVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 1 }}
                className="absolute -bottom-8 -left-8 w-auto px-6 py-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-border z-30 flex items-center gap-3"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 bg-gray-200 z-${i}`}
                    />
                  ))}
                </div>
                <div className="text-xs font-semibold">
                  <span className="text-primary">Trusted by</span>
                  <br />
                  Top Clinics
                </div>
              </motion.div>

              {/* Decorative Blob */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-full blur-3xl -z-10 transform rotate-12" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default LandingPageHero;
