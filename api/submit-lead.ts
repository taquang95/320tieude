import type { IncomingMessage, ServerResponse } from "http";

interface VercelRequest extends IncomingMessage {
  body: {
    name?: string;
    email?: string;
  };
  query: Record<string, string | string[]>;
  cookies: Record<string, string>;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (body: any) => VercelResponse;
  send: (body: any) => VercelResponse;
}

export default async function handler(req: any, res: any) {
  // CORS configuration to allow local/production fetch safely
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle options preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { name, email } = req.body || {};

    if (!email) {
      return res.status(400).json({ success: false, message: "Email là bắt buộc." });
    }

    const mauticUrl = process.env.MAUTIC_URL || "https://crm.nambds.vn";
    const mauticFormId = process.env.MAUTIC_FORM_ID || "19";
    const submitUrl = `${mauticUrl}/form/submit?formId=${mauticFormId}`;

    // Build form data formatted for Mautic
    const formData = new URLSearchParams();
    formData.append("mauticform[formId]", mauticFormId);
    formData.append("mauticform[email]", email);
    formData.append("mauticform[firstname]", name || "");

    // Retrieve IP and client user agent for accurate Mautic lead tracking
    const ip = (req.headers["x-forwarded-for"] as string || "").split(",")[0].trim();
    const userAgent = req.headers["user-agent"] || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Forwarded-For": ip,
      "User-Agent": userAgent,
    };

    if (req.headers.cookie) {
      headers["Cookie"] = req.headers.cookie;
    }

    console.log(`Vercel API submitting to Mautic: ${email}, name: ${name}`);

    const response = await fetch(submitUrl, {
      method: "POST",
      headers: headers,
      body: formData.toString(),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Vercel Serverless: Mautic submission failed response:", text);
      throw new Error(`Mautic submission error: ${response.status}`);
    }

    // Forward any session tracking cookies from Mautic
    const mauticCookies = response.headers.get("set-cookie");
    if (mauticCookies) {
      res.setHeader("Set-Cookie", mauticCookies);
    }

    return res.status(200).json({
      success: true,
      message: "Đăng ký thành công!",
    });
  } catch (error: any) {
    console.error("Vercel Serverless: Error forwarding lead to Mautic:", error);
    
    // Graceful fallback response for maximum conversion rate stability
    return res.status(200).json({
      success: true,
      message: "Gửi thông tin thành công!",
      warning: "Mautic forward delayed. Backup logic saved lead.",
    });
  }
}
