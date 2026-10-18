"use client";

import { useState, type FormEvent } from "react";

export default function HeaderSearch({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.dispatchEvent(new CustomEvent<string>("rtcrackers:search", { detail: query.trim() }));
    const target = document.getElementById("catalogue");
    if (target) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }

  return (
    <form className={`header-search ${className}`} role="search" onSubmit={submit}>
      <label className="sr-only" htmlFor={`header-search-${className.replace(/[^a-z0-9]/gi, "") || "default"}`}>
        Search the cracker catalogue
      </label>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="header-search-icon" fill="none">
        <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
        <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        id={`header-search-${className.replace(/[^a-z0-9]/gi, "") || "default"}`}
        type="search"
        inputMode="search"
        placeholder="Search sparklers, flower pots, rockets…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="submit" aria-label="Search products">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
          <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
}
