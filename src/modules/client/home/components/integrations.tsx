"use client";

import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring" },
  },
};

function LandingPageIntegrations() {
  const techItems = [
    { name: "HIPAA Compliant", icon: "HIPAA" },
    { name: "GDPR Compliant", icon: "GDPR" },
    { name: "ABDM Compliant", icon: "ABDM" },
    { name: "DPDPA Compliant", icon: "DPDPA" },
  ];

  return (
    <motion.section
      className="py-20 sm:py-28 bg-landing-muted/30"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={itemVariants}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-landing-foreground">
            Secure, Compliant, and Reliable
          </h2>
          <p className="mt-4 text-lg text-landing-muted-foreground">
            We are built on a modern, secure technology stack and adhere to the
            highest industry standards for data privacy and security.
          </p>
        </motion.div>

        {/* Tech Items Grid */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={containerVariants}
        >
          {techItems.map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center justify-center p-6 bg-landing-background rounded-2xl border border-landing-border shadow-sm transition-all duration-300 hover:shadow-lg"
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-4xl font-black text-landing-primary/80 tracking-tighter">
                {item.icon}
              </div>
              <p className="mt-2 text-center font-semibold text-landing-muted-foreground text-sm">
                {item.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default LandingPageIntegrations;
