import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // Maximum execution time in seconds
export const dynamic = "force-dynamic";

// Simple HTML sanitization - removes script tags and dangerous attributes
function sanitizeHtml(html: string): string {
  return (
    html
      // Remove script tags and their content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove event handlers (onclick, onload, etc.)
      .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "")
      // Remove javascript: protocol
      .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')
      .replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src="#"')
  );
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { html } = body;

    // Validate input
    if (!html || typeof html !== "string") {
      return NextResponse.json(
        { error: "HTML content is required and must be a string" },
        { status: 400 }
      );
    }

    // Check payload size (4.5MB Vercel limit, leave some margin)
    const htmlSize = new Blob([html]).size;
    if (htmlSize > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "HTML content is too large (max 4MB)" },
        { status: 413 }
      );
    }

    // Sanitize HTML to prevent XSS and malicious scripts
    const sanitizedHtml = sanitizeHtml(html);

    // Check if running on Vercel (production/preview) or locally
    const isVercel = !!process.env.VERCEL;

    let browser;

    if (isVercel) {
      // Use puppeteer-core with @sparticuz/chromium for Vercel
      const puppeteer = await import("puppeteer-core");
      const chromium = await import("@sparticuz/chromium");

      browser = await puppeteer.default.launch({
        args: chromium.default.args,
        defaultViewport: {
          width: 1920,
          height: 1080,
        },
        executablePath: await chromium.default.executablePath(),
        headless: true,
      });
    } else {
      // Use regular puppeteer for local development
      const puppeteer = await import("puppeteer");

      browser = await puppeteer.default.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    try {
      const page = await browser.newPage();

      // Set content with a timeout
      await page.setContent(sanitizedHtml, {
        waitUntil: "networkidle0",
        timeout: 30000, // 30 seconds timeout
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
        },
      });

      await browser.close();

      // Return PDF as a downloadable file
      return new NextResponse(Buffer.from(pdfBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="generated-${Date.now()}.pdf"`,
          "Cache-Control": "no-store",
        },
      });
    } catch (error) {
      await browser.close();
      throw error;
    }
  } catch (error) {
    console.error("PDF generation error:", error);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        return NextResponse.json(
          { error: "PDF generation timed out. Please try with simpler HTML." },
          { status: 504 }
        );
      }

      if (error.message.includes("Navigation failed")) {
        return NextResponse.json(
          { error: "Failed to render HTML. Please check your HTML syntax." },
          { status: 422 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate PDF. Please try again." },
      { status: 500 }
    );
  }
}
