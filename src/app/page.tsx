"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Keyboard, type KeyboardInteractionEvent } from "@/components/ui/keyboard";
import { ThemeToggle, type Theme } from "@/components/ui/theme-toggle";
import { FlashlightOverlay } from "@/components/ui/flashlight-overlay";

type KeyboardThemeName = "classic" | "mint" | "royal" | "dolch" | "sand" | "scarlet";

interface ThemeDef {
  name: KeyboardThemeName;
  label: string;
  accent: string;
}

const THEMES: ThemeDef[] = [
  { name: "classic", label: "Classic", accent: "#F57644" },
  { name: "mint", label: "Mint", accent: "#86C8AC" },
  { name: "royal", label: "Royal", accent: "#E4D440" },
  { name: "dolch", label: "Dolch", accent: "#D73E42" },
  { name: "sand", label: "Sand", accent: "#C94E41" },
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
  const [siteTheme, setSiteTheme] = useState<Theme>("light");
  const [typed, setTyped] = useState("");

  useEffect(() => {
    console.log("Site theme changed to:", siteTheme);
    // Sync site theme with document class
    if (siteTheme === "dark" || siteTheme === "real-dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [siteTheme]);

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
      className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-500 selection:bg-primary selection:text-primary-foreground relative overflow-hidden"
      style={{
        fontFamily: "var(--font-outfit)",
      }}
    >
      <ThemeToggle currentTheme={siteTheme} onThemeChange={setSiteTheme} />

      {siteTheme === "real-dark" && <FlashlightOverlay />}

      <div className="z-10 w-full max-w-4xl flex flex-col items-center gap-16 animate-in fade-in duration-1000">

        {/* Brand Header */}
        <header className="flex flex-col items-center select-none">
          <h1
            className="text-6xl font-black tracking-tighter text-foreground"
            style={{ lineHeight: 0.9 }}
          >
            Typii<span style={{ color: activeTheme.accent }}>.</span>
          </h1>

          <p className="text-[10px] text-muted-foreground mt-1 opacity-40 uppercase tracking-widest">
            Current Theme: {siteTheme}
          </p>
        </header>

        {/* Interaction Stage */}
        <div className="w-full flex flex-col items-center gap-10">

          {/* Typing Display */}
          <div className="w-full max-w-2xl px-4">
            <div className="w-full min-h-[100px] flex items-start justify-center text-center relative">
              <div
                className="font-normal text-3xl tracking-tight leading-relaxed text-foreground"
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  wordBreak: "break-all",
                  whiteSpace: "pre-wrap"
                }}
              >
                {typed || (
                  <span className="opacity-20">Start typing...</span>
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
                    className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.2em]"
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

          {/* Made By */}
          <p className="text-sm font-semibold text-muted-foreground tracking-widest uppercase">
            Made by{" "}
            <span style={{ color: activeTheme.accent }} className="font-black">Satyarth</span>
          </p>

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
                    background: isSelected ? t.accent : "var(--secondary)",
                    color: isSelected ? "#fff" : "var(--muted-foreground)",
                    boxShadow: isSelected ? `0 4px 12px ${t.accent}40` : "none",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

        </div>


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
