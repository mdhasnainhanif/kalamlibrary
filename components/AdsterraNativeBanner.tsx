"use client";

import { useEffect, useRef } from "react";

export default function AdsterraNativeBanner({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const adDiv = document.createElement("div");
    adDiv.id = "container-a0437e5a405cabbaa281844a0c35a5f1";
    container.appendChild(adDiv);

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://bauval.org/21/a0437e5a405cabbaa281844a0c35a5f1";
    container.appendChild(script);
  }, []);

  return (
    <div
      aria-label="Sponsored Content"
      className={`w-full flex justify-center items-center my-6 overflow-hidden px-2 ${className}`}
    >
      <div
        ref={containerRef}
        className="w-full max-w-[728px] flex justify-center items-center overflow-hidden"
      />
    </div>
  );
}
