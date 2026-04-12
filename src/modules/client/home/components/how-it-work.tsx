"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function LandingPageHowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description:
        "Sign up in minutes and set up your practice profile with our intuitive onboarding process.",
    },
    {
      number: "02",
      title: "Import Patient Data",
      description:
        "Securely migrate existing patient records or start fresh with our comprehensive data import tools.",
    },
    {
      number: "03",
      title: "Configure Your Workflow",
      description:
        "Customize the platform to match your practice needs with flexible settings and integrations.",
    },
    {
      number: "04",
      title: "Start Managing Patients",
      description:
        "Begin scheduling appointments, managing records, and providing better patient care immediately.",
    },
  ];

  return (
    <motion.section
      id="how-it-works"
      className="py-20 sm:py-28 bg-background overflow-hidden relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/20 to-transparent pointer-events-none" />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">
            Process
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get started with our platform in four simple steps and transform
            your practice.
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative mt-20">
          {/* Timeline line */}
          <motion.div
            className="absolute left-8 top-0 bottom-0 w-0.5 bg-border rounded-full lg:left-1/2 lg:-translate-x-1/2"
            aria-hidden="true"
            style={{ originY: 0 }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="absolute top-0 bottom-0 w-full bg-gradient-to-b from-primary/50 via-primary to-primary/50 opacity-50" />
          </motion.div>

          {/* Step items */}
          <motion.div
            className="relative flex flex-col items-start gap-y-12"
            variants={containerVariants}
          >
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`w-full flex items-start gap-6 lg:w-1/2 ${
                    isEven
                      ? "lg:self-start lg:pr-12"
                      : "lg:self-end lg:flex-row-reverse lg:pl-12"
                  }`}
                >
                  {/* Step Circle */}
                  <motion.div
                    className="relative z-10 flex-shrink-0"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="w-16 h-16 bg-background border-4 border-primary/20 rounded-full flex items-center justify-center shadow-lg shadow-primary/10 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                      <span className="text-2xl font-bold text-primary relative z-10">
                        {step.number}
                      </span>
                    </div>
                  </motion.div>

                  {/* Step Content */}
                  <div className={`pt-2 ${!isEven ? "lg:text-right" : ""}`}>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2 lg:inline-flex">
                      {step.title}
                      {isEven && (
                        <CheckCircle2 className="w-5 h-5 text-primary hidden lg:block" />
                      )}
                      {!isEven && (
                        <CheckCircle2 className="w-5 h-5 text-primary lg:hidden" />
                      )}
                    </h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default LandingPageHowItWorks;
