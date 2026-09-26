"use client";

/**
 * Shown when the root layout itself fails to render, which for this app
 * almost always means the site can't reach its settings or its database.
 */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#f6f8f4",
          color: "#1a221d",
        }}
      >
        <main style={{ maxWidth: 560, margin: "0 auto", padding: "64px 24px" }}>
          <h1 style={{ fontSize: 28, lineHeight: 1.1, margin: 0 }}>
            TaskJar can’t load right now.
          </h1>
          <p style={{ color: "#4a544e", marginTop: 12 }}>
            Something went wrong on our side. Try again in a moment.
          </p>
          <p style={{ color: "#4a544e" }}>
            If you run this site: open <code>/api/health</code> to see which
            settings are missing, add them in Vercel under Settings →
            Environment Variables, then redeploy.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 16,
              padding: "10px 16px",
              borderRadius: 8,
              border: 0,
              background: "#2f6b3a",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
