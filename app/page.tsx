"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [dummyLoading, setDummyLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    setLoading(true);
    setError(null);
    setPdfUrl(null);

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      const blob = await response.blob();
      const pdfBlobUrl = URL.createObjectURL(blob);
      setPdfUrl(pdfBlobUrl);
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
      a.download = `page-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleDummyPagePdf = async () => {
    setDummyLoading(true);
    setError(null);
    setPdfUrl(null);

    try {
      const dummyPageUrl = `${window.location.origin}/dummyPage`;

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: dummyPageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      const blob = await response.blob();
      const pdfBlobUrl = URL.createObjectURL(blob);
      setPdfUrl(pdfBlobUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setDummyLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>URL to PDF Generator</h1>
        <p className={styles.description}>
          Enter any webpage URL to convert it to a downloadable PDF.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            className={styles.urlInput}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
          />

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !url.trim()}
            >
              {loading ? "Generating PDF..." : "Generate PDF"}
            </button>

            <button
              type="button"
              onClick={handleDummyPagePdf}
              className={styles.dummyButton}
              disabled={dummyLoading}
            >
              {dummyLoading ? "Generating..." : "Generate PDF from Demo Page"}
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

        <div className={styles.tips}>
          <h3>Tips:</h3>
          <ul>
            <li>Enter the full URL including https://</li>
            <li>The page must be publicly accessible</li>
            <li>
              All styles, images, and fonts will be included automatically
            </li>
            <li>
              Generation may take 5-30 seconds depending on page complexity
            </li>
            <li>
              <a href="/dummypage" target="_blank" rel="noopener noreferrer">
                View demo page
              </a>{" "}
              (try the &quot;Generate PDF from Demo Page&quot; button)
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
