"use client";

import { useEffect, useRef } from "react";

export default function AdsterraDisplayBanner({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous script output if any
    container.innerHTML = "";

    const scriptConf = document.createElement("script");
    scriptConf.type = "text/javascript";
    scriptConf.text = `
      atOptions = {
        'key' : '79763e76b2836ef6fc89ce356b015b18',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    container.appendChild(scriptConf);

    const scriptInvoke = document.createElement("script");
    scriptInvoke.type = "text/javascript";
    scriptInvoke.src = "https://bauval.org/22/79763e76b2836ef6fc89ce356b015b18";
    container.appendChild(scriptInvoke);
  }, []);

  return (
    <div
      aria-label="Advertisement Banner"
      className={`w-full flex justify-center items-center my-4 overflow-hidden px-2 ${className}`}
    >
      <div
        ref={containerRef}
        className="w-full max-w-[728px] min-h-[90px] flex justify-center items-center overflow-hidden"
      />
    </div>
  );
}
