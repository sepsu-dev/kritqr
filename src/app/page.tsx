"use client";

import { useState, useRef, useCallback } from "react";
import { QRCode } from "react-qr-code";
import { toCanvas } from "qrcode";

function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "kritqr";
}

export default function Home() {
  const [text, setText] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [error, setError] = useState("");
  const [filename, setFilename] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  const generateQR = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Masukkan teks atau URL terlebih dahulu");
      return;
    }
    setError("");
    setQrValue(trimmed);
  }, [text]);

  const downloadQR = useCallback(async () => {
    if (!qrValue) return;
    try {
      const canvas = document.createElement("canvas");
      await toCanvas(canvas, qrValue, {
        width: 512,
        margin: 2,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      });
      const link = document.createElement("a");
      const name = filename.trim() ? sanitizeFilename(filename.trim()) : "kritqr";
      link.download = `${name}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      setError("Gagal mengunduh QR code");
    }
  }, [qrValue, filename]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") generateQR();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <header className="border-b border-border bg-white/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center">
          <div className="flex items-center gap-2.5">
            {/* QR-style logo */}
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center relative overflow-hidden">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="3" height="3" rx="0.5" />
                <rect x="19" y="14" width="2" height="2" rx="0.5" />
                <rect x="14" y="19" width="3" height="2" rx="0.5" />
                <rect x="19" y="18" width="2" height="3" rx="0.5" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Krit<span className="text-primary">QR</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Generate QR Code
            </h1>
            <p className="text-sm text-muted-foreground">
              Masukkan teks atau URL, lalu dapatkan QR code instan
            </p>
          </div>

          {/* Input Card */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="qr-input"
                className="text-sm font-medium text-foreground"
              >
                Teks / URL
              </label>
              <div className="flex gap-2">
                <input
                  id="qr-input"
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Contoh: https://example.com"
                  className="flex-1 h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  autoFocus
                />
                <button
                  onClick={generateQR}
                  className="h-11 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.97] transition-all shadow-sm shadow-primary/20 flex items-center gap-2 shrink-0"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Generate
                </button>
              </div>
              {error && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {error}
                </p>
              )}
            </div>

            {/* QR Code Display */}
            {qrValue && (
              <div className="space-y-4 pt-2">
                <div className="flex justify-center">
                  <div
                    ref={qrRef}
                    className="bg-white p-5 rounded-xl border border-border shadow-sm"
                  >
                    <QRCode
                      value={qrValue}
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#0f172a"
                      level="M"
                    />
                  </div>
                </div>

                {/* Filename Input */}
                <div>
                  <label
                    htmlFor="filename-input"
                    className="text-sm font-medium text-foreground block mb-1"
                  >
                    Nama file (opsional)
                  </label>
                  <input
                    id="filename-input"
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="kritqr (default)"
                    className="w-full h-10 px-4 rounded-xl border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={downloadQR}
                    className="flex-1 h-10 rounded-xl border border-border bg-background text-foreground font-medium text-sm hover:bg-muted active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
                      />
                    </svg>
                    Download PNG
                  </button>
                  <button
                    onClick={() => {
                      setText("");
                      setQrValue("");
                      setFilename("");
                      setError("");
                    }}
                    className="h-10 px-4 rounded-xl text-muted-foreground text-sm hover:text-foreground hover:bg-muted active:scale-[0.97] transition-all flex items-center gap-1.5"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Hasil QR code bisa langsung di-scan dengan kamera HP atau aplikasi QR scanner
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} KritQR
          </p>
        </div>
      </footer>
    </div>
  );
}