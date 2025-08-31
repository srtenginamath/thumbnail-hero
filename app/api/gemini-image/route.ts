/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseModalities: ["IMAGE", "TEXT"] },
    });

    console.log("RAW Gemini Response:", JSON.stringify(response, null, 2));

    let image = null;
    let text = null;
    const parts = response.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if (part.inlineData) {
        image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
      if (part.text) {
        text = part.text;
      }
    }

    if (!image) {
      return NextResponse.json(
        {
          error: "No image returned. Try a safer or clearer prompt.",
          details: text || "Image data missing",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ image, text });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate image" },
      { status: 500 }
    );
  }
}
