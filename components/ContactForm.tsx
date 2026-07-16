"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase";

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
      setErrorMsg("Please fill in all required fields (Name, Email, Message).");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .insert({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        });

      if (error) throw error;

      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      console.error("Form submission database insert failed:", err);
      setErrorMsg("Failed to submit form. Please make sure the 'contact_submissions' table exists in your database or try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-emerald-900/10 border border-emerald-500/10 rounded-2xl p-6 md:p-8 shadow-md">
      <h2 className="text-xl font-bold text-gold-500 mb-6 text-left">Send us a Message</h2>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs md:text-sm text-left">
          Thank you! Your submission has been received successfully. We will reply to you within 24–48 hours.
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs md:text-sm text-left">
          {errorMsg}
        </div>
      )}

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
            placeholder="Muhammad Hasnain"
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
            placeholder="hasnain@example.com"
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
            placeholder="e.g. Digitization request, lyrics typo fix..."
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
            placeholder="Type your query, citation corrections or transcription requests here..."
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
