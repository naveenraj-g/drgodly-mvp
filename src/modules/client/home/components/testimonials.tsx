"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function LandingPageTestimonials() {
  const testimonials = [
    {
      content:
        "This platform has completely transformed how we manage patient care. The interface is intuitive and our staff adapted quickly.",
      author: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
    },
    {
      content:
        "The scheduling system alone has saved us countless hours. Our no-show rate has dropped by 60% since implementing automated reminders.",
      author: "Michael Chen",
      role: "Practice Manager",
    },
    {
      content:
        "Security and compliance were our top concerns. This platform exceeded our expectations with robust HIPAA-compliant features.",
      author: "Dr. Emily Rodriguez",
      role: "Healthcare Administrator",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">
              Testimonials
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
              Trusted by Healthcare Professionals
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-border/50 bg-card hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-primary/20" />
                  </CardHeader>
                  <CardContent className="h-full flex flex-col justify-between gap-6">
                    <p className="text-muted-foreground italic flex-1">
                      {item.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-primary-foreground font-bold">
                        {item.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {item.author}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default LandingPageTestimonials;
