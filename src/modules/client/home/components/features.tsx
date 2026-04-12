"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  Brain,
  Shield,
  Clock,
  Smartphone,
  HeartPulse,
} from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

function LangingPageFeatures() {
  const features = [
    {
      icon: <Activity className="h-8 w-8 text-primary" />,
      title: "Real-Time Patient Monitoring",
      description:
        "Track patient vitals and health metrics in real-time with our advanced monitoring system.",
    },
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "AI-Powered Insights",
      description:
        "Leverage artificial intelligence to gain actionable insights and improve patient outcomes.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure & Compliant",
      description:
        "HIPAA-compliant platform with enterprise-grade security to protect sensitive patient data.",
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Efficient Scheduling",
      description:
        "Streamline appointments and reduce no-shows with intelligent scheduling and reminders.",
    },
    {
      icon: <Smartphone className="h-8 w-8 text-primary" />,
      title: "Mobile Access",
      description:
        "Access patient records and manage your practice from anywhere with our mobile app.",
    },
    {
      icon: <HeartPulse className="h-8 w-8 text-primary" />,
      title: "Comprehensive EHR",
      description:
        "Complete electronic health records system with intuitive interface and powerful features.",
    },
  ];

  return (
    <motion.section
      id="features"
      className="py-20 sm:py-28 bg-secondary/30"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={itemVariants}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">
            Features
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
            Everything You Need to Manage Healthcare
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful tools designed to streamline your workflow and improve
            patient care.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card transition-colors duration-300">
                <CardHeader>
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default LangingPageFeatures;
