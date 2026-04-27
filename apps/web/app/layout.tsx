import { Geist } from "next/font/google"
import { Agentation } from "agentation"
import { DarkModeProvider } from "@/components/live/dark-mode"
import { PaintGate } from "@/components/live/paint-gate"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata = {
  title: "Component Canvas",
  description: "An advanced component explorer.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint to set .dark from stored theme / system pref. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme:dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="h-full overflow-hidden flex flex-col font-sans">
        <PaintGate />
        <DarkModeProvider>{children}</DarkModeProvider>
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  )
}
