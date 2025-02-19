"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqData = [
  { question: "What is Vizify?", answer: "Vizify is a modern platform that allows you to create and share digital business cards effortlessly." },
  { question: "How does it work?", answer: "You can create a digital business card, generate a QR code for easy sharing, and download it as an image." },
  { question: "Is my data secure?", answer: "Yes, all your data is encrypted and stored securely with the latest security protocols." },
  { question: "Can I customize my card?", answer: "Absolutely! You can choose colors, styles, and add your branding to make your card unique." },
];

export default function FAQ() {
  return (
    <section className="max-w-4xl mx-auto px-6 md:px-12 py-24">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-3xl md:text-5xl font-bold text-center text-foreground mb-12"
      >
        Frequently Asked Questions
      </motion.h2>

      <Accordion type="single" collapsible className="space-y-2">
        {faqData.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
