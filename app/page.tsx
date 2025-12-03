"use client";

import { useState } from "react";
import styles from "./page.module.css";

const defaultHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #333; }
    p { line-height: 1.6; }
  </style>
</head>
<body>
  <h1>Sample PDF Document</h1>
  <p>This is a sample HTML document that will be converted to PDF.</p>
  <p>You can customize this HTML with your own content, styles, and structure.</p>
</body>
</html>`;

export default function Home() {
  const [html, setHtml] = useState(defaultHtml);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPdfUrl(null);

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      // Create a blob from the response
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `generated-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>HTML to PDF Generator</h1>
        <p className={styles.description}>
          Paste your HTML content below and click Generate PDF to convert it to
          a downloadable PDF file.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            className={styles.textarea}
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="Paste your HTML content here..."
            rows={15}
            required
          />

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !html.trim()}
            >
              {loading ? "Generating PDF..." : "Generate PDF"}
            </button>

            {pdfUrl && (
              <button
                type="button"
                onClick={handleDownload}
                className={styles.downloadButton}
              >
                Download PDF
              </button>
            )}
          </div>

          {error && (
            <div className={styles.error}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {pdfUrl && !error && (
            <div className={styles.success}>
              PDF generated successfully! Click the Download PDF button to save
              it.
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
