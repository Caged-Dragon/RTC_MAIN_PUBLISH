"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("rt-portfolio-theme");
    const value = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(value);
    document.documentElement.dataset.theme = value ? "dark" : "light";
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("rt-portfolio-theme", next ? "dark" : "light");
    document.documentElement.dataset.theme = next ? "dark" : "light";
  };
  return (
    <button type="button" onClick={toggle} aria-pressed={dark} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} className="theme-toggle">
      <span aria-hidden="true">{dark ? "☀" : "☾"}</span>
      <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
