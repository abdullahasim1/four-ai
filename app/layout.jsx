import "./globals.css";
import { Toaster } from "@/components/Toaster";
import GsapAnimations from "@/components/GsapAnimations";

export const metadata = {
  title: {
    default: "Four AI — AI Voice & Image Studio",
    template: "%s · Four AI",
  },
  description:
    "Four AI — studio-grade AI voice generation, text-to-speech, voice effects and AI image creation in one clean workspace.",
  icons: { icon: "/logo.png" },
};

export const viewport = {
  themeColor: "#070b16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GsapAnimations />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
