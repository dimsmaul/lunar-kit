"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

// interface SearchResult {
//   id: string;
//   url: string;
//   type: "page" | "heading" | "text";
//   content: string;
// }

// function SearchDialog({
//   open,
//   onClose,
// }: {
//   open: boolean;
//   onClose: () => void;
// }) {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState<SearchResult[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!open) {
//       setQuery("");
//       setResults([]);
//       return;
//     }
//   }, [open]);

//   useEffect(() => {
//     if (!query.trim()) {
//       setResults([]);
//       return;
//     }

//     const controller = new AbortController();
//     const timer = setTimeout(async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`, {
//           signal: controller.signal,
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setResults(data ?? []);
//         }
//       } catch {
//         // aborted or failed
//       } finally {
//         setLoading(false);
//       }
//     }, 200);

//     return () => {
//       clearTimeout(timer);
//       controller.abort();
//     };
//   }, [query]);

//   useEffect(() => {
//     const handleKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     if (open) {
//       document.addEventListener("keydown", handleKey);
//       document.body.style.overflow = "hidden";
//     }
//     return () => {
//       document.removeEventListener("keydown", handleKey);
//       document.body.style.overflow = "";
//     };
//   }, [open, onClose]);

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//         onClick={onClose}
//       />
//       {/* Dialog */}
//       <div className="relative w-full max-w-lg mx-4 rounded-2xl border border-foreground/10 bg-background shadow-2xl overflow-hidden">
//         {/* Search Input */}
//         <div className="flex items-center gap-3 px-4 py-3 border-b border-foreground/10">
//           <SearchIcon className="text-muted-foreground flex-shrink-0" />
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search documentation..."
//             className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:opacity-50"
//             autoFocus
//           />
//           <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono text-muted-foreground border border-foreground/10">
//             ESC
//           </kbd>
//         </div>
//         {/* Results */}
//         <div className="max-h-[300px] overflow-y-auto p-2">
//           {loading && (
//             <p className="px-3 py-6 text-center text-sm text-muted-foreground">
//               Searching...
//             </p>
//           )}
//           {!loading && query && results.length === 0 && (
//             <p className="px-3 py-6 text-center text-sm text-muted-foreground">
//               No results found.
//             </p>
//           )}
//           {!loading && !query && (
//             <p className="px-3 py-6 text-center text-sm text-muted-foreground">
//               Type to search docs...
//             </p>
//           )}
//           {results.map((result) => (
//             <Link
//               key={result.id}
//               href={result.url}
//               onClick={onClose}
//               className="flex flex-col gap-0.5 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
//             >
//               <span className="text-sm font-medium text-foreground">
//                 {result.content}
//               </span>
//               <span className="text-xs text-muted-foreground">{result.url}</span>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

export const emptySubscribe = () => () => {};

export function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [_, setSearchOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K to open search
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl transition-all duration-300 ${
          scrolled
            ? "rounded-2xl border border-foreground/[0.08] bg-background/70 backdrop-blur-xl shadow-lg"
            : "rounded-2xl border border-transparent bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-3">
          {/* Left - Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src={'/lunar-kit.svg'} 
              alt="Lunar Kit Logo" 
              width={24} 
              height={24} 
              className={mounted && !isDark ? "invert" : ""}
            />
            <span className="text-lg font-bold tracking-tight text-foreground">
              Lunar Kit
            </span>
          </Link>

          {/* Center - Nav Links */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              href="/docs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/docs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Components
            </Link>
            <a
              href="https://github.com/dimsmaul/lunar-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Right - Search + Theme Toggle */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-foreground/10 bg-foreground/[0.03] hover:bg-foreground/[0.06] transition-colors text-muted-foreground text-sm"
            >
              <SearchIcon />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-flex ml-1 px-1.5 py-0.5 rounded text-[10px] font-mono border border-foreground/10">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-foreground/10 bg-foreground/[0.03] hover:bg-foreground/[0.06] transition-colors text-foreground"
                aria-label="Toggle theme"
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Search Dialog */}
      {/* <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} /> */}
    </>
  );
}
