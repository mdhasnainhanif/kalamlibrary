import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

interface PageProps {
  searchParams: Promise<{ subject?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact Us - Support & Inquiries",
    description: "Get in touch with the Kalam Library team. Contact us on WhatsApp +92 317 4731957 or email md.hasnain.developer@gmail.com for corrections or requests.",
    alternates: {
      canonical: "https://kalamlibrary.com/contact",
    },
    openGraph: {
      title: "Contact Us - Support & Inquiries | Kalam Library",
      description: "Get in touch with the Kalam Library team. Contact us on WhatsApp +92 317 4731957 or email md.hasnain.developer@gmail.com.",
      url: "https://kalamlibrary.com/contact",
    },
  };
}

const GeometricPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.015] pointer-events-none -z-10"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
  >
    <defs>
      <pattern id="contact-geom" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M25 0 L50 25 L25 50 L0 25 Z M25 10 L25 40 M10 25 L40 25" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-gold-500" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#contact-geom)" />
  </svg>
);

export default async function ContactPage({ searchParams }: PageProps) {
  const { subject = "" } = await searchParams;

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Kalam Library",
    "description": "Contact methods for Kalam Library including WhatsApp support and online messaging form.",
    "mainEntity": {
      "@type": "ContactPoint",
      "telephone": "+92-317-4731957",
      "contactType": "customer support",
      "email": "md.hasnain.developer@gmail.com",
      "availableLanguage": ["Urdu", "English", "Hindi", "Bengali"]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <main className="w-full max-w-6xl mx-auto px-4 py-8 md:py-16 flex-grow relative text-left">
        <GeometricPattern />

        {/* Header */}
        <div className="text-center mb-12 border-b border-emerald-500/10 pb-6">
          <h1 className="text-3xl md:text-5xl font-bold text-gold-500 mb-4">Contact Us</h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Have questions, correction submissions, or book requests? Get in touch with our digitization team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Contact Details (1 Column) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Direct Cards */}
            <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/10 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-gray-200 uppercase tracking-wider">Direct Contacts</h2>
              
              {/* WhatsApp Card */}
              <a
                href="https://wa.me/923174731957"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow flex items-center gap-4 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-400/20 text-emerald-400 shrink-0">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.46 4.887 1.461 5.436-.001 9.861-4.43 9.864-9.869.003-2.636-1.018-5.114-2.875-6.974C16.602 1.95 14.135.928 11.5.927c-5.439 0-9.867 4.431-9.87 9.871-.001 1.765.467 3.49 1.357 5.018l-.989 3.607 3.659-.97zm11.755-7.25c-.322-.162-1.905-.94-2.2-.1.047-.297-.156-.454-.234-.57l-.375-.544c-.218-.328-.5-.331-.765-.112l-.24.2c-.22.18-.35.32-.5.53-.15.2-.28.45-.44.62-.31.33-.6.3-.92.12-.32-.18-.62-.38-.91-.6-.24-.18-.46-.38-.68-.6-.23-.23-.42-.48-.6-.74-.18-.26-.17-.4-.05-.55.12-.15.24-.31.36-.47.12-.16.16-.27.24-.45.08-.18.04-.33-.02-.49-.06-.16-.54-1.32-.74-1.81-.19-.48-.38-.41-.53-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.03 0 1.2.88 2.37 1 2.53.12.16 1.73 2.637 4.19 3.7c.584.253 1.04.404 1.396.517.588.187 1.123.161 1.546.098.472-.07 1.464-.599 1.67-1.177.206-.577.206-1.072.144-1.176-.06-.104-.22-.167-.54-.33z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-200 group-hover:text-gold-500 transition-colors text-sm">WhatsApp Chat</h3>
                  <p className="text-xs text-gray-400 mt-0.5">+92 317 4731957</p>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:md.hasnain.developer@gmail.com"
                className="p-4 rounded-xl bg-emerald-900/10 hover:bg-emerald-900/20 border border-emerald-500/10 hover-gold-glow flex items-center gap-4 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-950 flex items-center justify-center border border-gold-500/25 text-gold-500 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-200 group-hover:text-gold-500 transition-colors text-sm">Email Address</h3>
                  <p className="text-xs text-gray-400 mt-0.5 break-words">md.hasnain.developer@gmail.com</p>
                </div>
              </a>

            </div>

            {/* Note Panel */}
            <div className="p-6 rounded-2xl bg-emerald-900/10 border border-emerald-500/10 text-left">
              <h3 className="text-sm font-bold text-gold-500 mb-2">Response Expectation</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We read every submission. We usually reply within **24 to 48 hours**. For digitization requests, processing timelines may vary depending on the count of pages in the submitted PDF files.
              </p>
            </div>

          </div>

          {/* Form Ingestion (2 Columns) */}
          <div className="lg:col-span-2">
            <ContactForm defaultSubject={subject} />
          </div>

        </div>
      </main>
    </>
  );
}
