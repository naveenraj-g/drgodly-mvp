"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

function LangingPageBenefits() {
  const benefits = [
    "Reduce administrative overhead by 40%",
    "Improve patient satisfaction scores",
    "Streamline billing and insurance claims",
    "Access records from any device",
    "Automated appointment reminders",
    "Comprehensive reporting and analytics",
  ];

  return (
    <section className="py-20 sm:py-28 bg-secondary/30">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">
              Benefits
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
              Why Healthcare Providers Choose Us
            </h2>
            <p className="mt-4 text-lg text-muted-foreground mb-8">
              Join thousands of healthcare professionals who have transformed
              their practice with our platform.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual/Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 border border-border/50 shadow-2xl"
          >
            {/* Abstract Medical UI Mockup */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 bg-card rounded-xl shadow-xl border border-border p-6 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-muted rounded" />
                    <div className="w-20 h-3 bg-muted/50 rounded" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="w-full h-8 bg-muted/30 rounded" />
                  <div className="w-full h-8 bg-muted/30 rounded" />
                  <div className="w-2/3 h-8 bg-muted/30 rounded" />
                </div>

                {/* Floating Badge */}
                <div className="absolute bottom-6 right-6 px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-lg text-sm font-bold">
                  Efficiency +40%
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default LangingPageBenefits;
