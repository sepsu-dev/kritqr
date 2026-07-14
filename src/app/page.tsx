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
  const [padding, setPadding] = useState(20);
  const [qrKey, setQrKey] = useState(0);
  const [fgColor, setFgColor] = useState("#0f172a");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [format, setFormat] = useState<"png" | "jpg">("png");
  const qrRef = useRef<HTMLDivElement>(null);

  const generateQR = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Masukkan teks atau URL terlebih dahulu");
      return;
    }
    setError("");
    setQrValue(trimmed);
    setQrKey((k) => k + 1);
  }, [text]);

  const downloadQR = useCallback(async () => {
    if (!qrValue) return;
    try {
      const canvas = document.createElement("canvas");
      await toCanvas(canvas, qrValue, {
        width: 512,
        margin: Math.round(padding / 10),
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      const mime = format === "jpg" ? "image/jpeg" : "image/png";
      const ext = format === "jpg" ? "jpg" : "png";
      const link = document.createElement("a");
      const name = filename.trim() ? sanitizeFilename(filename.trim()) : "kritqr";
      link.download = `${name}.${ext}`;
      link.href = canvas.toDataURL(mime, format === "jpg" ? 0.92 : undefined);
      link.click();
    } catch {
      setError("Gagal mengunduh QR code");
    }
  }, [qrValue, filename, padding, fgColor, bgColor, format]);

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
className="flex-1 h-11 px-4 rounded-2xl border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  autoFocus
                />
                <button
                  onClick={generateQR}
className="h-11 px-5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.97] transition-all shadow-sm shadow-primary/20 flex items-center gap-2 shrink-0"
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
className="rounded-2xl border border-border shadow-sm animate-fade-scale-in"
                    style={{ padding: `${padding}px`, backgroundColor: bgColor }}
                    key={qrKey}
                  >
                    <QRCode
                      value={qrValue}
                      size={200}
                      bgColor={bgColor}
                      fgColor={fgColor}
                      level="M"
                    />
                  </div>
                </div>

                  {/* Color Pickers */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="fg-color"
                        className="text-sm font-medium text-foreground block mb-1"
                      >
                        Warna QR
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="fg-color"
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
className="w-9 h-9 rounded-2xl border border-border cursor-pointer p-0.5 bg-transparent"
                        />
                        <span className="text-xs text-muted-foreground font-mono">{fgColor}</span>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="bg-color"
                        className="text-sm font-medium text-foreground block mb-1"
                      >
                        Background
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="bg-color"
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
className="w-9 h-9 rounded-2xl border border-border cursor-pointer p-0.5 bg-transparent"
                        />
                        <span className="text-xs text-muted-foreground font-mono">{bgColor}</span>
                      </div>
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
className="w-full h-10 px-4 rounded-2xl border border-border bg-muted/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                {/* Padding Slider */}
                <div>
                  <label
                    htmlFor="padding-slider"
                    className="text-sm font-medium text-foreground block mb-1"
                  >
                    Padding : <span className="text-primary font-semibold">{padding}px</span>
                  </label>
                  <input
                    id="padding-slider"
                    type="range"
                    min={0}
                    max={50}
                    value={padding}
                    onChange={(e) => setPadding(Number(e.target.value))}
className="w-full h-2 rounded-2xl bg-muted appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={downloadQR}
className="flex-1 h-10 rounded-2xl border border-border bg-background text-foreground font-medium text-sm hover:bg-muted active:scale-[0.97] transition-all flex items-center justify-center gap-2"
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
                    Download {format.toUpperCase()}
                  </button>
                  <button
                    onClick={() => setFormat((f) => (f === "png" ? "jpg" : "png"))}
className="h-10 px-3 rounded-2xl border border-border bg-background text-muted-foreground text-sm hover:text-foreground hover:bg-muted active:scale-[0.97] transition-all flex items-center gap-1 shrink-0"
                    title={`Ganti ke ${format === "png" ? "JPG" : "PNG"}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    {format === "png" ? "JPG" : "PNG"}
                  </button>
                  <button
                    onClick={() => {
                      setText("");
                      setQrValue("");
                      setFilename("");
                      setPadding(20);
                      setFgColor("#0f172a");
                      setBgColor("#ffffff");
                      setFormat("png");
                      setError("");
                    }}
className="h-10 px-4 rounded-2xl text-muted-foreground text-sm hover:text-foreground hover:bg-muted active:scale-[0.97] transition-all flex items-center gap-1.5"
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