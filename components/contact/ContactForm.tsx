"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
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
      message: "",
    };

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.message;
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
      className="p-8 rounded-3xl w-full mx-auto"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
    >
      <div className="flex flex-col gap-4">
        {/* NAME */}
        <div>
          <label className="block text-sm font-medium text-background mb-2">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full p-4 rounded-4xl  bg-gray-900/15 text-background transition-all placeholder:text-black/40 ${
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
          <label className="block text-sm font-medium text-background mb-2">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full p-4 rounded-4xl  bg-gray-900/15 text-background transition-all placeholder:text-black/40 ${
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

        {/* MESSAGE */}
        <div>
          <label className="block text-sm font-medium text-background mb-2">Message</label>
          <textarea
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            className={`w-full p-4 rounded-4xl text-background outline-1 outline-gray-500 bg-white/80 resize-none transition-all placeholder:text-black/40 ${
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

      <div className="flex justify-end mt-8">
        <motion.button
          type="submit"
          className="rounded-4xl px-6 py-4 bg-gold-700 text-background font-medium hover:bg-gold-800 active:scale-95"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Send Message
        </motion.button>
      </div>
      
    </motion.form>
  );
}