import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";



export const metadata: Metadata = {
    title: "Cheko",
    description: "Browse our restaurant menu",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
        <body className="min-h-full flex flex-col bg-white dark:bg-[#121212] text-[#1E1E1E] dark:text-white transition-colors duration-200">
        <NavBar />
        <main className="flex-1 bg-white dark:bg-[#121212] transition-colors duration-200">
            {children}
        </main>
        </body>
        </html>
    );
}