"use client";

import { useEffect, useState } from "react";

export function FlashlightOverlay() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-500"
      style={{
        background: `radial-gradient(circle 150px at ${position.x}px ${position.y}px, transparent 0%, transparent 60%, rgba(0, 0, 0, 0.98) 100%)`,
      }}
    />
  );
}
