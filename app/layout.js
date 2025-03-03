import { ContextProvider } from "@/components/ContextWrapper";
import SessionWrapper from "@/components/SessionWrapper";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Imagegram",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`dark:bg-black ${geistSans.variable} ${geistMono.variable} flex-wrap antialiased container flex gap-[100px] justify-center`}
      >
       
        <SessionWrapper>
        <ContextProvider>
        <Sidebar/>
        {children}
        </ContextProvider>
        </SessionWrapper>
         
      </body>
    </html>
  );
}
