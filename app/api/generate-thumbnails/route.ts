// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { type NextRequest, NextResponse } from "next/server";
// import { generateText } from "ai";
// import { google } from "@ai-sdk/google";

// export async function POST(request: NextRequest) {
//   try {
//     const { enhancedPrompt, style, placement, uploadedImage } =
//       await request.json();

//     if (!enhancedPrompt) {
//       return NextResponse.json(
//         { error: "Enhanced prompt is required" },
//         { status: 400 }
//       );
//     }

//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json(
//         {
//           error:
//             "Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables.",
//         },
//         { status: 500 }
//       );
//     }

//     const generateImageWithGemini = async (
//       prompt: string,
//       inputImage?: string
//     ) => {
//       const parts = [];
//       if (prompt.trim()) {
//         parts.push({ text: prompt });
//       }
//       if (inputImage) {
//         const [mimeType, base64Data] = inputImage.split(";base64,");
//         parts.push({
//           inlineData: {
//             mimeType: mimeType.replace("data:", ""),
//             data: base64Data,
//           },
//         });
//       }

//       const payload = {
//         contents: [{ parts }],
//         generationConfig: {
//           responseModalities: ["IMAGE", "TEXT"],
//         },
//       };

//       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `Gemini API request failed with status: ${response.status}. ${errorText}`
//         );
//       }

//       const result = await response.json();
//       const base64Data = result?.candidates?.[0]?.content?.parts?.find(
//         (p: any) => p.inlineData
//       )?.inlineData?.data;

//       if (!base64Data) {
//         throw new Error("No image data received from Gemini API");
//       }

//       return `data:image/png;base64,${base64Data}`;
//     };

//     const imageGenerationPrompts = [];

//     try {
//       const { text: variationsText } = await generateText({
//         model: google("gemini-1.5-flash"),
//         system: `You are a creative director specializing in YouTube thumbnails. Generate 4 distinct creative variations of the given prompt, each with different visual approaches but maintaining the core concept.

// Format each variation as a detailed image generation prompt. Include:
// - Composition details
// - Color schemes
// - Typography placement
// - Visual elements
// - Mood and lighting

// Make each variation unique while staying true to the original concept.`,
//         prompt: `Base prompt: "${enhancedPrompt}"
// Style: ${style}
// Photo placement: ${placement}
// Has uploaded image: ${uploadedImage ? "Yes" : "No"}

// Generate 4 creative variations for thumbnail generation.`,
//         temperature: 0.8,
//       });

//       const variations = variationsText
//         .split("\n\n")
//         .filter((v: string) => v.trim())
//         .slice(0, 4);
//       imageGenerationPrompts.push(...variations);
//     } catch (aiError) {
//       console.error("Gemini variation generation error:", aiError);
//       return NextResponse.json(
//         {
//           error:
//             "Failed to generate prompt variations. Please check your API configuration.",
//         },
//         { status: 500 }
//       );
//     }

//     const thumbnails = [];

//     for (let i = 0; i < Math.min(4, imageGenerationPrompts.length); i++) {
//       const prompt = imageGenerationPrompts[i];
//       const format = i < 2 ? "horizontal" : "vertical";

//       try {
//         const imageUrl = await generateImageWithGemini(prompt, uploadedImage);

//         thumbnails.push({
//           id: `${i + 1}`,
//           format,
//           url: imageUrl,
//           downloadUrl: imageUrl,
//           prompt,
//           aiGenerated: true,
//           model: "gemini-2.5-flash-image-preview",
//         });
//       } catch (imageError) {
//         console.error(`Failed to generate image ${i + 1}:`, imageError);
//         return NextResponse.json(
//           {
//             error: `Failed to generate thumbnail ${i + 1}: ${
//               imageError instanceof Error
//                 ? imageError.message
//                 : String(imageError)
//             }`,
//           },
//           { status: 500 }
//         );
//       }
//     }

//     return NextResponse.json({
//       thumbnails,
//       creditsUsed: 1,
//       generationId: `gen_${Date.now()}`,
//       hybridPrompting: true,
//       aiModel: "gemini-2.5-flash-image-preview",
//       generatedPrompts: imageGenerationPrompts,
//     });
//   } catch (error) {
//     console.error("Thumbnail generation error:", error);
//     return NextResponse.json(
//       { error: "Failed to generate thumbnails" },
//       { status: 500 }
//     );
//   }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

// Upload image to fal storage
async function uploadToFal(fileBase64: string): Promise<string> {
  const [meta, base64Data] = fileBase64.split(";base64,");
  const mimeType = meta.replace("data:", "");
  const buffer = Buffer.from(base64Data, "base64");

  const formData = new FormData();
  formData.append("file", new Blob([buffer], { type: mimeType }), "upload.png");

  const res = await fetch("https://fal.run/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload to fal");
  }

  const data = await res.json();
  return data.url;
}

export async function POST(request: NextRequest) {
  try {
    const { enhancedPrompt, style, placement, uploadedImage } =
      await request.json();

    if (!enhancedPrompt) {
      return NextResponse.json(
        { error: "Enhanced prompt is required" },
        { status: 400 }
      );
    }

    // If user uploaded an image, upload to fal storage
    let imageUrl: string | null = null;
    if (uploadedImage) {
      imageUrl = await uploadToFal(uploadedImage);
    }

    // Build final prompt (include style + placement)
    const finalPrompt = `${enhancedPrompt}. Style: ${style}. Placement: ${placement}.`;

    // Call fal nano-banana/edit
    const result = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: {
        prompt: finalPrompt,
        image_urls: imageUrl ? [imageUrl] : [],
      },
      logs: true,
    });

    if (!result.data?.images || result.data.images.length === 0) {
      return NextResponse.json(
        { error: "No images returned from fal-ai" },
        { status: 500 }
      );
    }

    // Map into your thumbnail structure
    const thumbnails = result.data.images.map((img: any, index: number) => ({
      id: `${index + 1}`,
      format: index < 2 ? "horizontal" : "vertical",
      url: img.url,
      downloadUrl: img.url,
      prompt: finalPrompt,
      aiGenerated: true,
      model: "fal-ai/nano-banana/edit",
    }));

    return NextResponse.json({
      thumbnails,
      creditsUsed: 1,
      generationId: `gen_${Date.now()}`,
      hybridPrompting: true,
      aiModel: "fal-ai/nano-banana/edit",
      generatedPrompts: [finalPrompt],
    });
  } catch (error) {
    console.error("Thumbnail generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate thumbnails" },
      { status: 500 }
    );
  }
}
