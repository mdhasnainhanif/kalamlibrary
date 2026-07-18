"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ContactForm({ defaultSubject = "" }: { defaultSubject?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    if (!name || !email || !message) {
      const valErr = "Please fill in all required fields (Name, Email, Message).";
      setErrorMsg(valErr);
      toast.error(valErr);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const result = await res.json();

      if (!res.ok || result.error) {
        throw new Error(result.error || "Failed to submit message");
      }

      setSuccess(true);
      toast.success("Your message has been sent successfully!");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      console.error("Form submission failed:", err);
      const dbErr = err.message || "Failed to submit form. Please try again later.";
      setErrorMsg(dbErr);
      toast.error(dbErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-emerald-900/10 border border-emerald-500/10 rounded-2xl p-6 md:p-8 shadow-md">
      <h2 className="text-xl font-bold text-gold-500 mb-6 text-left">Send us a Message</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
        <div>
          <label htmlFor="form-name" className="block text-xs font-semibold uppercase text-gray-400 mb-2">
            Your Name *
          </label>
          <input
            id="form-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all text-sm"
          />
        </div>

        <div>
          <label htmlFor="form-email" className="block text-xs font-semibold uppercase text-gray-400 mb-2">
            Email Address *
          </label>
          <input
            id="form-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all text-sm"
          />
        </div>

        <div>
          <label htmlFor="form-subject" className="block text-xs font-semibold uppercase text-gray-400 mb-2">
            Subject
          </label>
          <input
            id="form-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter your subject type"
            className="w-full px-4 py-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all text-sm"
          />
        </div>

        <div>
          <label htmlFor="form-message" className="block text-xs font-semibold uppercase text-gray-400 mb-2">
            Message *
          </label>
          <textarea
            id="form-message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            className="w-full px-4 py-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all text-sm resize-y"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-fit px-6 py-3 rounded-xl bg-gold-500 text-black font-bold text-sm hover:bg-gold-600 transition-colors shadow-lg shadow-gold-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
