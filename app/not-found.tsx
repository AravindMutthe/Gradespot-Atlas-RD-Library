import Link from "next/link";

// Helpful custom 404 (2026-10-28 completion): server component, no client
// code, no JavaScript. Reuses the existing wording and links only to
// existing routes. Site header/footer apply via the root layout.
export default function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p>This page could not be found.</p>
      <nav aria-label="Recovery">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/library">Library</Link>
          </li>
          <li>
            <Link href="/search">Search</Link>
          </li>
          <li>
            <Link href="/system-explorer">System Explorer</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
