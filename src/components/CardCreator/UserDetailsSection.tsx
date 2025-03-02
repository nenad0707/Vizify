"use client";

import { useCardCreator } from "./CardCreatorContext";
import { FormSectionWrapper } from "./shared/FormSectionWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { User, AlertCircle, Check } from "lucide-react";

export function UserDetailsSection() {
  const { formData, updateFormData, validateStep } = useCardCreator();

  const nameValid = formData.name.trim().length > 0;
  const titleValid = formData.title.trim().length > 0;
  const emailValid =
    !formData.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  // Fields are invalid if they're touched (not empty) but invalid
  const nameInvalid = formData.name !== "" && !nameValid;
  const titleInvalid = formData.title !== "" && !titleValid;
  const emailInvalid = formData.email !== "" && !emailValid;

  // Next button disabled state
  const nextDisabled = !nameValid || !titleValid || emailInvalid;

  return (
    <FormSectionWrapper
      title="Your Details"
      description="Tell us about yourself"
      icon={<User className="h-5 w-5" />}
      nextDisabled={nextDisabled}
    >
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <div className="flex justify-between">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <AnimatePresence>
              {nameValid && formData.name && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-green-500 flex items-center text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Valid
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="relative">
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              placeholder="John Smith"
              className={`transition-all ${
                nameInvalid
                  ? "border-red-400 focus:border-red-500 pr-10"
                  : "border-border/60 focus:border-primary"
              }`}
            />
            <AnimatePresence>
              {nameInvalid && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                >
                  <AlertCircle className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {nameInvalid && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-500 mt-1"
              >
                Please provide your full name
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="space-y-2"
        >
          <div className="flex justify-between">
            <Label htmlFor="title" className="text-sm font-medium">
              Job Title <span className="text-red-500">*</span>
            </Label>
            <AnimatePresence>
              {titleValid && formData.title && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-green-500 flex items-center text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Valid
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="relative">
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) => updateFormData("title", e.target.value)}
              placeholder="Product Manager"
              className={`transition-all ${
                titleInvalid
                  ? "border-red-400 focus:border-red-500 pr-10"
                  : "border-border/60 focus:border-primary"
              }`}
            />
            <AnimatePresence>
              {titleInvalid && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                >
                  <AlertCircle className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {titleInvalid && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-500 mt-1"
              >
                Please provide your job title
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Email field with animation and validation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-2"
        >
          <div className="flex justify-between">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <AnimatePresence>
              {emailValid && formData.email && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="text-green-500 flex items-center text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Valid
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              placeholder="john@example.com"
              className={`transition-all ${
                emailInvalid
                  ? "border-red-400 focus:border-red-500 pr-10"
                  : "border-border/60 focus:border-primary"
              }`}
            />
            <AnimatePresence>
              {emailInvalid && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                >
                  <AlertCircle className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {emailInvalid && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-500 mt-1"
              >
                Please provide a valid email address
              </motion.p>
            )}
          </AnimatePresence>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            className="text-xs text-muted-foreground mt-4"
          >
            Your email will be used to display contact information on your card.
          </motion.p>
        </motion.div>
      </div>
    </FormSectionWrapper>
  );
}
