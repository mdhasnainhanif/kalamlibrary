"use client";

import { useEffect, useRef } from "react";

export default function AdsterraDisplayBanner({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const iframe = document.createElement("iframe");
    iframe.width = "728";
    iframe.height = "90";
    iframe.title = "Advertisement";
    iframe.frameBorder = "0";
    iframe.scrolling = "no";
    iframe.className = "border-0 overflow-hidden mx-auto block max-w-full";
    iframe.style.width = "728px";
    iframe.style.height = "90px";
    iframe.style.maxWidth = "100%";

    const content = `<!DOCTYPE html>
<html>
  <head>
    <base target="_blank">
    <style>
      body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      atOptions = {
        'key' : '79763e76b2836ef6fc89ce356b015b18',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    </script>
    <script type="text/javascript" src="https://bauval.org/22/79763e76b2836ef6fc89ce356b015b18"></script>
  </body>
</html>`;

    container.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(content);
      doc.close();
    }
  }, []);

  return (
    <div
      aria-label="Advertisement Banner"
      className={`w-full flex justify-center items-center my-4 overflow-hidden px-2 ${className}`}
    >
      <div
        ref={containerRef}
        className="w-full max-w-[728px] min-h-[90px] flex justify-center items-center overflow-hidden rounded-xl border border-emerald-500/15 bg-black/20"
      />
    </div>
  );
}
