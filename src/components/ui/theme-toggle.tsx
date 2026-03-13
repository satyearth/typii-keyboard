"use client";

import { useEffect, useState, useRef } from "react";
import { flushSync } from "react-dom";
import { Sun, Moon, Zap, Type } from "lucide-react";
import { cn } from "@/lib/utils";

export type Theme = "light" | "dark" | "real-dark";

interface ThemeToggleProps {
  onThemeChange: (theme: Theme) => void;
  currentTheme: Theme;
}

export function ThemeToggle({ onThemeChange, currentTheme }: ThemeToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleTheme = (newTheme: Theme, e: React.MouseEvent) => {
    console.log("Toggle theme clicked for:", newTheme);
    // Set position variables for the CSS animation
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      document.documentElement.style.setProperty("--x", `${x}px`);
      document.documentElement.style.setProperty("--y", `${y}px`);
    }

    // View Transition API logic
    if (!(document as any).startViewTransition) {
      onThemeChange(newTheme);
      setIsOpen(false);
      return;
    }

    (document as any).startViewTransition(() => {
      flushSync(() => {
        onThemeChange(newTheme);
        setIsOpen(false);
      });
    });
  };

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    const isLightSite = currentTheme === "light";
    const itemBaseClass = "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium leading-none w-full";
    const itemActiveLight = "bg-black/5 text-black";
    const itemActiveDark = "bg-white/10 text-white";
    const itemInactiveLight = "hover:bg-black/5 text-black/60 hover:text-black";
    const itemInactiveDark = "hover:bg-white/5 text-white/60 hover:text-white";

    return (
        <div className="fixed top-6 right-6 z-[10001]">
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "p-3 rounded-full transition-all duration-300 shadow-lg border border-white/10",
                isLightSite ? "bg-white text-black" : "bg-neutral-900 text-white",
                "hover:scale-110 active:scale-95"
              )}
            >
              {currentTheme === "light" && <Sun size={20} />}
              {currentTheme === "dark" && <Moon size={20} />}
              {currentTheme === "real-dark" && <Zap size={20} className="text-yellow-400 fill-yellow-400" />}
            </button>
    
            {isOpen && (
              <div 
                ref={menuRef}
                className={cn(
                "absolute top-full right-0 mt-3 p-1 rounded-2xl shadow-2xl border flex flex-col gap-1 min-w-[180px] animate-in fade-in zoom-in duration-200 origin-top-right",
                isLightSite ? "bg-white/90 backdrop-blur-md border-black/5" : "bg-neutral-900/90 backdrop-blur-md border-white/5"
              )}>
                <button
                  onClick={(e) => toggleTheme("light", e)}
                  className={cn(
                    itemBaseClass,
                    currentTheme === "light" ? itemActiveLight : (isLightSite ? itemInactiveLight : itemInactiveDark)
                  )}
                >
                  <Sun size={16} />
                  <span>Light</span>
                </button>
                <button
                  onClick={(e) => toggleTheme("dark", e)}
                  className={cn(
                    itemBaseClass,
                    currentTheme === "dark" ? (isLightSite ? itemActiveLight : itemActiveDark) : (isLightSite ? itemInactiveLight : itemInactiveDark)
                  )}
                >
                  <Moon size={16} />
                  <span>Dark</span>
                </button>
                <button
                  onClick={(e) => toggleTheme("real-dark", e)}
                  className={cn(
                    itemBaseClass, "justify-between",
                    currentTheme === "real-dark" ? "bg-yellow-400/20 text-yellow-500" : (isLightSite ? "text-black/60 hover:text-black hover:bg-black/5" : "text-white/60 hover:text-white hover:bg-white/5")
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Zap size={16} className={currentTheme === "real-dark" ? "fill-yellow-400" : ""} />
                    <span>The Real Dark</span>
                  </div>
                  <span className="text-[10px] bg-yellow-400/20 text-yellow-600 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold border border-yellow-400/30">New</span>
                </button>
              </div>
            )}
          </div>
        </div>
      );
}
