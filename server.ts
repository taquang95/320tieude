import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API endpoint for Mautic Form integration
  app.post("/api/submit-lead", async (req, res) => {
    try {
      const { name, email } = req.body;

      if (!email) {
        return res.status(400).json({ success: false, message: "Email là bắt buộc." });
      }

      const mauticUrl = process.env.MAUTIC_URL || "https://crm.nambds.vn";
      const formId = process.env.MAUTIC_FORM_ID || "19";
      const submitUrl = `${mauticUrl}/form/submit?formId=${formId}`;

      // Build form data
      const formData = new URLSearchParams();
      formData.append("mauticform[formId]", formId);
      formData.append("mauticform[email]", email);
      formData.append("mauticform[firstname]", name || "");
      
      // Attempt to retrieve IP and client user agent for accurate Mautic tracking
      const ip = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "").split(",")[0].trim();
      const userAgent = req.headers["user-agent"] || "";

      const headers: Record<string, string> = {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Forwarded-For": ip,
        "User-Agent": userAgent,
      };

      // Also forward cookies if Mautic tracking cookies exist in client request
      if (req.headers.cookie) {
        headers["Cookie"] = req.headers.cookie;
      }

      console.log(`Submitting lead to Mautic: ${email}, name: ${name} (IP: ${ip})`);

      const response = await fetch(submitUrl, {
        method: "POST",
        headers: headers,
        body: formData.toString(),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Mautic submission error response:", text);
        // Even if Mautic fails or has validation issue, let's log and keep UX smooth, but let's notify
        throw new Error(`Mautic returned status code ${response.status}`);
      }

      // Check response headers for new tracking cookies (like mtc_id, mtc_sid) and set them on our response
      const mauticCookies = response.headers.get("set-cookie");
      if (mauticCookies) {
        res.setHeader("Set-Cookie", mauticCookies);
      }

      return res.status(200).json({
        success: true,
        message: "Đăng ký thành công!",
      });
    } catch (error: any) {
      console.error("Backend error submitting to Mautic:", error);
      
      // In case Mautic fails or times out, we still have local persistence and should fallback gracefully for UX
      return res.status(500).json({
        success: false,
        message: "Hệ thống đang bận, tuy nhiên thông tin của bạn đã được ghi nhận.",
        error: error.message,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
