import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 120, email: 254, subject: 200, message: 5000 } as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const honeypot = typeof body.company === "string" ? body.company.trim() : "";

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Required fields are missing: name, email, message" },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email) || name.length > MAX.name || email.length > MAX.email) {
      return NextResponse.json({ error: "Invalid name or email." }, { status: 400 });
    }

    if (subject.length > MAX.subject || message.length > MAX.message) {
      return NextResponse.json({ error: "Message or subject is too long." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Contact API: missing Supabase server env vars");
      return NextResponse.json({ error: "Server configuration error." }, { status: 503 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { error: dbError } = await supabaseAdmin.from("contact_submissions").insert({
      name,
      email,
      subject,
      message,
    });

    if (dbError) {
      console.error("Supabase contact insertion error:", dbError);
      return NextResponse.json({ error: "Failed to store submission in database." }, { status: 500 });
    }

    const smtpPass = process.env.SMTP_PASSWORD;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpFrom = process.env.SMTP_FROM;
    const smtpTo = process.env.SMTP_TO;

    if (smtpPass && smtpHost && smtpUser && smtpFrom && smtpTo) {
      try {
        const port = parseInt(smtpPort || "465", 10);
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port,
          secure: port === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: `"Kalam Library Contact" <${smtpFrom}>`,
          to: smtpTo,
          replyTo: email,
          subject: `New Contact Submission: ${subject || "No Subject"}`,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "None"}\n\n${message}`,
        });
      } catch (emailErr) {
        console.error("Nodemailer SMTP email send failure:", emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API contact error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
