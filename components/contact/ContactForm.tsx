"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactForm() {
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
    if (!formData.email.trim()) newErrors.email = "Email is required";
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

      alert("Email sent successfully!");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email");
    }
  };

  return (
    <motion.form
      noValidate
      onSubmit={handleSendEmail}
      className="mb-12 p-8 bg-white/50 border border-black/10 rounded-2xl w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
    >
      <div className="grid grid-cols-1 gap-4 mb-6">
        {/* NAME */}
        <div>
          <label className="block text-sm font-medium text-background mb-2">
            Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 rounded-lg bg-white/80 transition-all placeholder:text-black/40 ${
              errors.name
                ? "border border-red-500 focus:ring-2 focus:ring-red-500/30"
                : "border border-black/10 focus:ring-2 focus:ring-gold-700/20"
            }`}
            placeholder="Your name"
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
          <label className="block text-sm font-medium text-background mb-2">
            Email
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 rounded-lg bg-white/80 transition-all placeholder:text-black/40 ${
              errors.email
                ? "border border-red-500 focus:ring-2 focus:ring-red-500/30"
                : "border border-black/10 focus:ring-2 focus:ring-gold-700/20"
            }`}
            placeholder="your@email.com"
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

        {/* SUBJECT */}
        <div>
          <label className="block text-sm font-medium text-background mb-2">
            Subject
          </label>
          <input
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 rounded-lg bg-white/80 transition-all placeholder:text-black/40 ${
              errors.subject
                ? "border border-red-500 focus:ring-2 focus:ring-red-500/30"
                : "border border-black/10 focus:ring-2 focus:ring-gold-700/20"
            }`}
            placeholder="Subject of your message"
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

        {/* MESSAGE */}
        <div>
          <label className="block text-sm font-medium text-background mb-2">
            Message
          </label>
          <textarea
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 rounded-lg bg-white/80 resize-none transition-all placeholder:text-black/40 ${
              errors.message
                ? "border border-red-500 focus:ring-2 focus:ring-red-500/30"
                : "border border-black/10 focus:ring-2 focus:ring-gold-700/20"
            }`}
            placeholder="Your message here..."
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

      <motion.button
        type="submit"
        className="w-full py-3 px-6 bg-gold-700 text-background rounded-lg font-medium hover:bg-gold-800 active:scale-95"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Send Message
      </motion.button>
    </motion.form>
  );
}