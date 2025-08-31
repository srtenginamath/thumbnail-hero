/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY! });

export async function POST(req: Request) {
  const { imageUrl, prompt } = await req.json();

  try {
    const result = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: {
        prompt,
        image_urls: [imageUrl],
      },
      logs: true,
    });

    // result.data: matches Output schema
    return NextResponse.json({
      images: result.data.images,
      description: result.data.description,
    });
  } catch (err: any) {
    console.error("Fal.ai Error:", err);
    return NextResponse.json(
      { error: err.message || "Fal API failed" },
      { status: 500 }
    );
  }
}
