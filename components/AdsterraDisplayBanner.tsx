"use client";

export default function AdsterraDisplayBanner({ className = "" }: { className?: string }) {
  return (
    <div
      aria-label="Advertisement Banner"
      className={`w-full flex justify-center items-center my-4 overflow-hidden px-2 ${className}`}
    >
      <div className="w-full max-w-[728px] min-h-[90px] flex justify-center items-center overflow-hidden">
        <iframe
          title="Advertisement"
          srcDoc={`<!DOCTYPE html>
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
</html>`}
          width={728}
          height={90}
          className="border-0 overflow-hidden max-w-full"
          scrolling="no"
        />
      </div>
    </div>
  );
}
