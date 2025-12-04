import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        {
          error:
            "Invalid URL format. Please provide a valid URL (e.g., https://example.com)",
        },
        { status: 400 }
      );
    }

    // Check if running on Vercel or locally
    const isVercel = !!process.env.VERCEL;
    let browser;

    if (isVercel) {
      console.log("Running on Vercel, using puppeteer-core");
      const puppeteer = await import("puppeteer-core");
      const chromium = await import("@sparticuz/chromium");

      const executablePath = await chromium.default.executablePath();
      console.log("Chrome executable path:", executablePath);

      browser = await puppeteer.default.launch({
        args: [...chromium.default.args, "--disable-gpu", "--no-zygote"],
        defaultViewport: { width: 1920, height: 1080 },
        executablePath: executablePath,
        headless: true,
      });
      console.log("Browser launched successfully");
    } else {
      console.log("Running locally, using puppeteer");
      const puppeteer = await import("puppeteer");
      browser = await puppeteer.default.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    try {
      const page = await browser.newPage();

      // Navigate to the URL
      await page.goto(url, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
      });

      await browser.close();

      return new NextResponse(Buffer.from(pdfBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="page-${Date.now()}.pdf"`,
          "Cache-Control": "no-store",
        },
      });
    } catch (error) {
      await browser.close();
      throw error;
    }
  } catch (error) {
    console.error("PDF generation error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "N/A");

    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        return NextResponse.json(
          {
            error:
              "PDF generation timed out. The page may be too complex or slow to load.",
          },
          { status: 504 }
        );
      }

      if (
        error.message.includes("Navigation failed") ||
        error.message.includes("net::ERR")
      ) {
        return NextResponse.json(
          {
            error:
              "Failed to access the URL. Please check that it's publicly accessible.",
          },
          { status: 422 }
        );
      }

      // In development/testing, return the actual error
      if (process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview") {
        return NextResponse.json(
          { error: `Failed to generate PDF: ${error.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate PDF. Please try again." },
      { status: 500 }
    );
  }
}
