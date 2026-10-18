"use client";

type NavLink = { href: string; label: string };

/** A swipeable nav strip for compact viewports; intentionally has no dropdown or drawer. */
export default function MobileNav({ links }: { links: NavLink[] }) {
  return (
    <nav className="header-nav-row" aria-label="Main navigation">
      <div className="header-nav-scroll mx-auto flex max-w-7xl items-center gap-7 px-4 lg:px-6">
        {links.map((link) => <a key={link.href} href={link.href} className="nav-link">{link.label}</a>)}
      </div>
    </nav>
  );
}
