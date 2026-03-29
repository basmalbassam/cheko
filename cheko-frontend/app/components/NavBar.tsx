"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavBar() {
    const pathname = usePathname();
    const [dark, setDark] = useState(() => {
        if (typeof window === "undefined") return false;
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
            document.documentElement.style.backgroundColor = "#121212";
            document.body.style.backgroundColor = "#121212";
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const toggleTheme = () => {
        const isDark = !dark;
        setDark(isDark);
        if (isDark) {
            document.documentElement.classList.add("dark");
            document.documentElement.style.backgroundColor = "#121212";
            document.body.style.backgroundColor = "#121212";
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.style.backgroundColor = "#ffffff";
            document.body.style.backgroundColor = "#ffffff";
            localStorage.setItem("theme", "light");
        }
    };

    const isActive = (href: string) => {
        if (href === "/menu") return pathname === "/menu" || pathname === "/";
        return pathname === href;
    };

    return (
        <nav className="bg-[#1E1E1E] px-6 py-4 flex items-center gap-2">
            <Link
                href="/menu"
                className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive("/menu")
                        ? "bg-pink-300 text-black"
                        : "text-white hover:bg-white/10"
                }`}
            >
                Home
            </Link>

            <Link
                href="/map"
                className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive("/map")
                        ? "bg-pink-300 text-black"
                        : "text-white hover:bg-white/10"
                }`}
            >
                Map
            </Link>

            <button
                onClick={toggleTheme}
                className="ml-auto text-white p-2 rounded-full hover:bg-white/10 transition text-lg"
                title="Toggle dark mode"
            >
                {dark ? "☀️" : "🌙"}
            </button>
        </nav>
    );
}