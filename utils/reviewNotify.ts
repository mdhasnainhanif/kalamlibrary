import nodemailer from "nodemailer";

export async function notifyAdminNewReview(reviewId: string) {
  const smtpPass = process.env.SMTP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpFrom = process.env.SMTP_FROM;
  const smtpTo = process.env.SMTP_TO;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kalamlibrary.me";

  if (!smtpPass || !smtpHost || !smtpUser || !smtpFrom || !smtpTo) return;

  try {
    const port = parseInt(smtpPort || "465", 10);
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port,
      secure: port === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"Kalam Library" <${smtpFrom}>`,
      to: smtpTo,
      subject: "New reader review pending moderation",
      text: `A new review was submitted and is pending approval.\n\nReview ID: ${reviewId}\nModerate: ${siteUrl}/admin/reviews?status=pending\n`,
    });
  } catch (err) {
    console.error("Review notification email failed:", err);
  }
}
