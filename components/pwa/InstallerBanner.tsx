"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show,           setShow]           = useState(false);
  const [isIOS,          setIsIOS]          = useState(false);
  const [isDismissed,    setIsDismissed]    = useState(false);

  useEffect(() => {
    // Check if already dismissed
    if (sessionStorage.getItem("pwa-banner-dismissed")) return;

    // Detect iOS (Safari doesn't fire beforeinstallprompt)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    if (standalone) return; // Already installed

    if (ios) {
      setIsIOS(true);
      setShow(true);
      return;
    }

    // Android / Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    sessionStorage.setItem("pwa-banner-dismissed", "1");
    setIsDismissed(true);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
    dismiss();
  }

  if (!show || isDismissed) return null;

  return (
    <div className="pwa-banner md:hidden">
      <Image
        src="/icons/icon-72x72.png"
        alt="AIRA"
        width={40}
        height={40}
        className="rounded-xl flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight" style={{ color: "var(--aira-gold-light)" }}>
          Install AIRA App
        </p>
        <p className="text-xs mt-0.5 opacity-60">
          {isIOS
            ? 'Tap Share → "Add to Home Screen"'
            : "Add to your home screen for the best experience"}
        </p>
      </div>
      {!isIOS && (
        <button
          onClick={install}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0"
          style={{ background: "var(--aira-gold)", color: "#fff" }}
        >
          <Download size={12} /> Install
        </button>
      )}
      <button
        onClick={dismiss}
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
