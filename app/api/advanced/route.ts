/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import OpenAI from "openai";

fal.config({ credentials: process.env.FAL_KEY! });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { imageUrl, videoType, style, placement, prompt } = await req.json();

  const systemPrompt = `You are an expert YouTube thumbnail prompt enhancer. Your task is to transform basic prompts into detailed, engaging descriptions that will generate compelling thumbnails.

Style Guidelines:
- Gaming: Epic gaming setup, RGB lighting, dramatic shadows, bold typography, high contrast colors, action-packed composition
- Lifestyle: Clean minimalist design, soft natural lighting, warm color palette, lifestyle photography style, modern typography  
- Tech: Sleek modern tech aesthetic, gradient backgrounds, clean lines, futuristic elements, professional lighting
- Professional: Corporate professional design, clean typography, business color palette, structured layout, trustworthy aesthetic

Transform the user's prompt into a detailed description that includes:
1. Visual composition details
2. Color scheme suggestions
3. Typography style
4. Lighting and mood
5. Trending elements for engagement

Keep the enhanced prompt under 200 words and make it actionable for image generation.`;

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
