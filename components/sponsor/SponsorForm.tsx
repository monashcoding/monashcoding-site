"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SponsorForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Handle form input changes. Clears errors on change.
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Clear status when user types
    if (status.type) {
      setStatus({ type: null, message: "" });
    }
  };

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form fields
  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      subject: "",
      message: "",
    };

    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.subject && !newErrors.message;
  };

  const handleSendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          emailAddress: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setStatus({
        type: "success",
        message: "Sent!",
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    }
  };

  return (
    <motion.form
      noValidate
      onSubmit={handleSendEmail}
      className="p-8 rounded-lgw-full mx-auto bg-white"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
    >
      <div className="flex flex-col gap-6">
        {/* Heading */}
        <div className="text-center"> 
          <h2 className="text-2xl font-bold text-background">sponsorship@monashcoding.com</h2>

        </div>

        {/* SUBJECT */}
        <div>
          <input
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={`w-full p-4 rounded-lg bg-gray-900/15 text-background transition-all placeholder:text-black/40 ${
              errors.subject
                ? "border border-red-500 focus:ring-2 focus:ring-red-500/30"
                : "border border-black/10 focus:ring-2 focus:ring-gold-700/20"
            }`}
            placeholder="Subject"
          />
          <AnimatePresence>
            {errors.subject && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.subject}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* NAME */}
        <div>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full p-4 rounded-lg bg-gray-900/15 text-background transition-all placeholder:text-black/40 ${
              errors.name
                ? "border border-red-500 focus:ring-2 focus:ring-red-500/30"
                : "border border-black/10 focus:ring-2 focus:ring-gold-700/20"
            }`}
            placeholder="Company Name"
          />
          <AnimatePresence>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.name}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* EMAIL */}
        <div>
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full p-4 rounded-lg bg-gray-900/15 text-background transition-all placeholder:text-black/40 ${
              errors.email
                ? "border border-red-500 focus:ring-2 focus:ring-red-500/30"
                : "border border-black/10 focus:ring-2 focus:ring-gold-700/20"
            }`}
            placeholder="Email"
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        
        

        {/* MESSAGE */}
        <div>
          <textarea
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            className={`w-full p-4 rounded-lgtext-background outline-1 outline-gray-500 bg-white/80 resize-none transition-all placeholder:text-black/40 ${
              errors.message
                ? "border border-red-500 focus:ring-2 focus:ring-red-500/30"
                : "border border-black/10 focus:ring-2 focus:ring-gold-700/20"
            }`}
            placeholder="Message"
          />
          <AnimatePresence>
            {errors.message && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      

      <div className="flex mt-4 w-full flex-row justify-between items-center">
        {/* Status Message */}
      <AnimatePresence mode="wait" >
        {status.type && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3"
          >
            {/* Icon Circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`p-3 rounded-full flex items-center justify-center ${
                status.type === "success"
                  ? "bg-gold-500"
                  : "bg-red-500"
              }`}
            >
              {status.type === "success" ? (
                <svg
                  className="w-5 h-5 text-background"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-background"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </motion.div>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-lg font-medium ${
                status.type === "success"
                  ? "text-green-700 font-semibold"
                  : "text-red-600"
              }`}
            >
              {status.message}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty div to keep button on right when no status */}
      {!status.type && <div />}
        
          <motion.button
          type="submit"
          className="rounded-lgpx-6 py-4 bg-gold-700 text-background font-medium hover:bg-gold-800  active:scale-95"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Send Message
        </motion.button>
        
      </div>
      
    </motion.form>
  );
}