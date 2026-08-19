import { NextResponse } from "next/server";

type ContactPayload = { name?: unknown; email?: unknown; company?: unknown; projectType?: unknown; message?: unknown; website?: unknown; startedAt?: unknown };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedProjectTypes = new Set(["Business collaboration", "Technology partnership", "Investment opportunity", "Other"]);
const attempts = new Map<string, number[]>();
const windowMs = 10 * 60 * 1000;

const clean = (value: unknown, maxLength: number) => typeof value === "string" ? value.trim().slice(0, maxLength) : "";
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 12_000) return NextResponse.json({ message: "Request is too large." }, { status: 413 });

  let body: ContactPayload;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Invalid request." }, { status: 400 }); }
  if (clean(body.website, 200)) return NextResponse.json({ message: "Thank you. Your inquiry has been received." });

  const startedAt = Number(body.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 2500) return NextResponse.json({ message: "Please wait a moment before submitting." }, { status: 422 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anonymous";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((timestamp) => now - timestamp < windowMs);
  if (recent.length >= 3) return NextResponse.json({ message: "Too many inquiries. Please try again later or use email." }, { status: 429 });
  attempts.set(ip, [...recent, now]);

  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const company = clean(body.company, 120);
  const projectType = clean(body.projectType, 80);
  const message = clean(body.message, 2000);
  if (name.length < 2) return NextResponse.json({ message: "Please enter your name." }, { status: 422 });
  if (!emailPattern.test(email)) return NextResponse.json({ message: "Please enter a valid email address." }, { status: 422 });
  if (!allowedProjectTypes.has(projectType)) return NextResponse.json({ message: "Please choose a valid project type." }, { status: 422 });
  if (message.length < 20 || message.length > 2000) return NextResponse.json({ message: "Message must be between 20 and 2,000 characters." }, { status: 422 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) return NextResponse.json({ message: "Online delivery is being configured. Please email ajmal@gholzad.com directly." }, { status: 503 });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio inquiry — ${projectType}`,
        html: `<h2>New portfolio inquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Company:</strong> ${escapeHtml(company || "—")}</p><p><strong>Project type:</strong> ${escapeHtml(projectType)}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Delivery failed");
    return NextResponse.json({ message: "Thank you. Your inquiry has been sent successfully." });
  } catch {
    return NextResponse.json({ message: "We could not send this inquiry. Please use the email link instead." }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
