/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import OpenAI from "openai";

fal.config({ credentials: process.env.FAL_KEY! });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { imageUrl, videoType, style, placement } = await req.json();

  try {
    // 1. Rewrite prompt using OpenAI
    const reasoning = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a creative assistant that rewrites thumbnail prompts.",
        },
        {
          role: "user",
          content: `Video type: ${videoType}\nStyle: ${style}\nPlacement: ${placement}`,
        },
      ],
    });

    const rewrittenPrompt =
      reasoning.choices[0].message?.content ||
      "Make a professional YouTube thumbnail.";

    // 2. Generate horizontal thumbnail
    const horizontal = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: {
        prompt: rewrittenPrompt + " Format: 16:9 YouTube thumbnail.",
        image_urls: [imageUrl],
        num_images: 3,
      },
    });

    // 3. Generate vertical thumbnail
    const vertical = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: {
        prompt:
          rewrittenPrompt +
          " Format: 9:16 vertical thumbnail for Shorts/Reels.",
        image_urls: [imageUrl],
        num_images: 3,
      },
    });

    return NextResponse.json({
      rewrittenPrompt,
      horizontal: horizontal.data.images,
      vertical: vertical.data.images,
    });
  } catch (err: any) {
    console.error("Advanced flow error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
