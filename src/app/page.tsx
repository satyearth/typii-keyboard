"use client";
import { useState, useCallback, useMemo } from "react";
import { Keyboard, type KeyboardInteractionEvent } from "@/components/ui/keyboard";

type KeyboardThemeName = "classic" | "mint" | "royal" | "dolch" | "sand" | "scarlet";

interface ThemeDef {
  name: KeyboardThemeName;
  label: string;
  accent: string;
}

const THEMES: ThemeDef[] = [
  { name: "classic", label: "Classic", accent: "#F57644" },
  { name: "mint",    label: "Mint",    accent: "#86C8AC" },
  { name: "royal",   label: "Royal",   accent: "#E4D440" },
  { name: "dolch",   label: "Dolch",   accent: "#D73E42" },
  { name: "sand",    label: "Sand",    accent: "#C94E41" },
  { name: "scarlet", label: "Scarlet", accent: "#D5868A" },
];

const KEY_MAP: Record<string, string> = {
  Space: " ",
  Enter: "\n",
  Backspace: "BACKSPACE",
  Tab: "    ",
  Minus: "-",
  Equal: "=",
  BracketLeft: "[",
  BracketRight: "]",
  Backslash: "\\",
  Semicolon: ";",
  Quote: "'",
  Backquote: "`",
  Comma: ",",
  Period: ".",
  Slash: "/",
};

function keyCodeToChar(code: string): string | null {
  if (KEY_MAP[code]) return KEY_MAP[code];
  if (code.startsWith("Key")) return code.slice(3).toLowerCase();
  if (code.startsWith("Digit")) return code.slice(5);
  return null;
}

export default function Page() {
  const [themeName, setThemeName] = useState<KeyboardThemeName>("classic");
  const [typed, setTyped] = useState("");

  const activeTheme = useMemo(() => 
    THEMES.find((t) => t.name === themeName) || THEMES[0], 
    [themeName]
  );

  const handleKeyEvent = useCallback((event: KeyboardInteractionEvent) => {
    if (event.phase !== "down") return;
    if (event.code === "Backspace") {
      setTyped((prev) => prev.slice(0, -1));
      return;
    }
    const ch = keyCodeToChar(event.code);
    if (ch) setTyped((prev) => prev + ch);
  }, []);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-[#ffffff] selection:bg-black selection:text-white"
      style={{
        fontFamily: "var(--font-outfit)",
      }}
    >
      <div className="z-10 w-full max-w-4xl flex flex-col items-center gap-16 animate-in fade-in duration-1000">
        
        {/* Brand Header */}
        <header className="flex flex-col items-center select-none">
          <h1
            className="text-6xl font-black tracking-tighter text-[#111]"
            style={{ lineHeight: 0.9 }}
          >
            Typii<span style={{ color: activeTheme.accent }}>.</span>
          </h1>
        </header>

        {/* Interaction Stage */}
        <div className="w-full flex flex-col items-center gap-10">
          
          {/* Typing Display */}
          <div className="w-full max-w-2xl px-4">
            <div className="w-full min-h-[100px] flex items-start justify-center text-center relative">
              <div 
                className="font-normal text-3xl tracking-tight leading-relaxed text-[#111]"
                style={{ 
                  fontFamily: "var(--font-dm-mono)",
                  wordBreak: "break-all",
                  whiteSpace: "pre-wrap"
                }}
              >
                {typed || (
                  <span className="opacity-10">Start typing...</span>
                )}
                <span
                  className="inline-block w-[2px] h-[1em] ml-1 rounded-full animate-blink"
                  style={{ 
                    background: activeTheme.accent,
                    verticalAlign: 'middle',
                  }}
                />
              </div>
              
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <span 
                  className="text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 whitespace-nowrap"
                  style={{ color: activeTheme.accent }}
                >
                  {typed.length} Characters
                </span>
                {typed.length > 0 && (
                  <button
                    onClick={() => setTyped("")}
                    className="text-[10px] font-bold text-gray-300 hover:text-black transition-colors uppercase tracking-[0.2em]"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Keyboard Container */}
          <div className="mt-4 scale-[0.9] md:scale-100 transition-transform">
             <Keyboard
                theme={themeName}
                enableHaptics
                enableSound
                onKeyEvent={handleKeyEvent}
              />
          </div>

          {/* Theme Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
             {THEMES.map((t) => {
                const isSelected = themeName === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => setThemeName(t.name)}
                    className="px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300"
                    style={{
                      background: isSelected ? t.accent : "#f5f5f5",
                      color: isSelected ? "#fff" : "#999",
                      boxShadow: isSelected ? `0 4px 12px ${t.accent}40` : "none",
                    }}
                  >
                    {t.label}
                  </button>
                );
             })}
          </div>

        </div>

        {/* Footer moved up and made visible */}
        <footer className="mt-4">
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">
              Made by <span style={{ color: activeTheme.accent }}>Satyearth</span>
           </p>
        </footer>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </main>
  );
}
