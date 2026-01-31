import { NextResponse } from "next/server";

// مهم جدًا عشان Vercel ما يحاولش يعمل static للـ API
export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const { type } = params;

  try {
    if (type === "branches") {
      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw6nvh15toKj3Qt8CRo06JMB8iBOZ37t7Nhcxt73-TY3FGN_8R4b_KzRQYtq828rgPC/exec";
      const res = await fetch(SCRIPT_URL);
      const data = await res.json();
      return NextResponse.json(data);
    }

    if (type === "location") {
      const { searchParams } = new URL(req.url);
      const lat = searchParams.get("lat");
      const lon = searchParams.get("lon");
      const ua = searchParams.get("ua");
      const ip = searchParams.get("ip");

      const SCRIPT_URL = `https://script.google.com/macros/s/AKfycby_k7_4L7w-F5Dg9w-pRHnVj0FluA1bixYug7iTFm-mS1JcmIm8y7cGrldOR91BszX-/exec?lat=${lat}&lon=${lon}&ua=${encodeURIComponent(ua)}&ip=${ip}`;

      const res = await fetch(SCRIPT_URL);
      const text = await res.text();

      return new NextResponse(text, {
        headers: { "Content-Type": "text/plain" },
      });
    }

    return NextResponse.json(
      { error: "Unknown proxy type" },
      { status: 400 }
    );

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
