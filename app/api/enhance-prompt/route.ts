// import { type NextRequest, NextResponse } from "next/server";
// import { generateText } from "ai";
// import { google } from "@ai-sdk/google";

// export async function POST(request: NextRequest) {
//   try {
//     const { prompt, style } = await request.json();

//     if (!prompt) {
//       return NextResponse.json(
//         { error: "Prompt is required" },
//         { status: 400 }
//       );
//     }

//     const systemPrompt = `You are an expert YouTube thumbnail prompt enhancer. Your task is to transform basic prompts into detailed, engaging descriptions that will generate compelling thumbnails.

// Style Guidelines:
// - Gaming: Epic gaming setup, RGB lighting, dramatic shadows, bold typography, high contrast colors, action-packed composition
// - Lifestyle: Clean minimalist design, soft natural lighting, warm color palette, lifestyle photography style, modern typography
// - Tech: Sleek modern tech aesthetic, gradient backgrounds, clean lines, futuristic elements, professional lighting
// - Professional: Corporate professional design, clean typography, business color palette, structured layout, trustworthy aesthetic

// Transform the user's prompt into a detailed description that includes:
// 1. Visual composition details
// 2. Color scheme suggestions
// 3. Typography style
// 4. Lighting and mood
// 5. Trending elements for engagement

// Keep the enhanced prompt under 200 words and make it actionable for image generation.`;

//     try {
//       const { text: enhancedPrompt } = await generateText({
//         model: google("gemini-1.5-flash"),
//         system: systemPrompt,
//         prompt: `Original prompt: "${prompt}"
// Style: ${style}

// Please enhance this prompt for YouTube thumbnail generation, incorporating the style guidelines and making it more detailed and engaging.`,
//         temperature: 0.7,
//       });

//       const { text: suggestionsText } = await generateText({
//         model: google("gemini-1.5-flash"),
//         system:
//           "You are a YouTube optimization expert. Provide 4 brief, actionable suggestions to improve thumbnail performance.",
//         prompt: `For this thumbnail concept: "${enhancedPrompt}"

// Provide 4 specific suggestions to increase click-through rates and engagement.`,
//         temperature: 0.8,
//       });

//       const suggestions = suggestionsText
//         .split("\n")
//         .filter((s) => s.trim())
//         .slice(0, 4);

//       return NextResponse.json({
//         enhancedPrompt,
//         suggestions:
//           suggestions.length > 0
//             ? suggestions
//             : [
//                 "Add trending keywords for better reach",
//                 "Include emotional triggers in text",
//                 "Use contrasting colors for better visibility",
//                 "Consider seasonal trends",
//               ],
//         hybridPrompting: true,
//         model: "gemini-1.5-flash",
//       });
//     } catch (aiError) {
//       console.error("Gemini API error:", aiError);

//       const enhancedPrompts = {
//         gaming: `${prompt} | Epic gaming setup with RGB lighting, dramatic shadows, bold typography, high contrast colors, action-packed composition, trending gaming aesthetics, professional esports style`,
//         lifestyle: `${prompt} | Clean minimalist design, soft natural lighting, warm color palette, lifestyle photography style, Instagram-worthy composition, modern typography, aspirational mood`,
//         tech: `${prompt} | Sleek modern tech aesthetic, gradient backgrounds, clean lines, futuristic elements, professional lighting, tech-savvy color scheme, innovation-focused design`,
//         professional: `${prompt} | Corporate professional design, clean typography, business color palette, structured layout, trustworthy aesthetic, LinkedIn-ready composition, authority-building elements`,
//       };

//       const enhanced =
//         enhancedPrompts[style as keyof typeof enhancedPrompts] ||
//         `${prompt} | Professional YouTube thumbnail with eye-catching design, bold text, vibrant colors, high engagement potential, click-worthy composition`;

//       return NextResponse.json({
//         enhancedPrompt: enhanced,
//         suggestions: [
//           "Add trending keywords for better reach",
//           "Include emotional triggers in text",
//           "Use contrasting colors for better visibility",
//           "Consider seasonal trends",
//         ],
//         hybridPrompting: false,
//         model: "fallback",
//       });
//     }
//   } catch (error) {
//     console.error("Prompt enhancement error:", error);
//     return NextResponse.json(
//       { error: "Failed to enhance prompt" },
//       { status: 500 }
//     );
//   }
// }.

import { type NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: NextRequest) {
  try {
    const { prompt, style } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

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
      // --- Enhance the prompt ---
      const { text: enhancedPrompt } = await generateText({
        model: google("gemini-1.5-flash"),
        system: systemPrompt,
        prompt: `Original prompt: "${prompt}"
Style: ${style}

Please enhance this prompt for YouTube thumbnail generation.`,
        temperature: 0.7,
      });

      // --- Get improvement suggestions ---
      const { text: suggestionsText } = await generateText({
        model: google("gemini-1.5-flash"),
        system:
          "You are a YouTube optimization expert. Provide 4 brief, actionable suggestions to improve thumbnail performance.",
        prompt: `For this thumbnail concept: "${enhancedPrompt}"
Provide 4 specific suggestions to increase click-through rates and engagement.`,
        temperature: 0.8,
      });

      const suggestions = suggestionsText
        .split("\n")
        .filter((s) => s.trim())
        .slice(0, 4);

      return NextResponse.json({
        enhancedPrompt,
        suggestions:
          suggestions.length > 0
            ? suggestions
            : [
                "Add trending keywords for better reach",
                "Include emotional triggers in text",
                "Use contrasting colors for better visibility",
                "Consider seasonal trends",
              ],
        hybridPrompting: true,
        model: "gemini-1.5-flash",
      });
    } catch (aiError) {
      console.error("Gemini API error:", aiError);

      // --- fallback mode ---
      const enhancedPrompts = {
        gaming: `${prompt} | Epic gaming setup with RGB lighting, dramatic shadows, bold typography, high contrast colors, action-packed composition`,
        lifestyle: `${prompt} | Clean minimalist design, soft natural lighting, warm color palette, lifestyle photography style, Instagram-worthy composition`,
        tech: `${prompt} | Sleek modern tech aesthetic, gradient backgrounds, clean lines, futuristic elements, professional lighting`,
        professional: `${prompt} | Corporate professional design, clean typography, business color palette, structured layout, trustworthy aesthetic`,
      };

      const enhanced =
        enhancedPrompts[style as keyof typeof enhancedPrompts] ||
        `${prompt} | Professional YouTube thumbnail with eye-catching design, bold text, vibrant colors, high engagement potential`;

      return NextResponse.json({
        enhancedPrompt: enhanced,
        suggestions: [
          "Add trending keywords for better reach",
          "Include emotional triggers in text",
          "Use contrasting colors for better visibility",
          "Consider seasonal trends",
        ],
        hybridPrompting: false,
        model: "fallback",
      });
    }
  } catch (error) {
    console.error("Prompt enhancement error:", error);
    return NextResponse.json(
      { error: "Failed to enhance prompt" },
      { status: 500 }
    );
  }
}
