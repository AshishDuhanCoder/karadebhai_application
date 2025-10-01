"use server"

import { generateText } from "ai"

export async function validateImageWithAI(imageBase64: string, category: string) {
  try {
    console.log("[v0] Starting validation for category:", category)
    console.log("[v0] Image data length:", imageBase64.length)
    console.log("[v0] Image starts with:", imageBase64.substring(0, 50))

    const categoryDescriptions: Record<string, string> = {
      pothole: "a pothole, damaged road, cracked pavement, or road defect",
      garbage: "garbage, litter, trash, waste, or scattered rubbish",
      streetlight: "broken streetlight, damaged electrical pole, exposed wires, or electrical hazard",
      sewageissue: "sewage problem, open drain, manhole issue, or drainage problem",
      stagnantwater: "stagnant water, puddle, waterlogging, or standing water",
      constructiondebris: "construction debris, building materials, rubble, or construction waste",
    }

    const categoryDesc = categoryDescriptions[category] || category

    console.log("[v0] Calling AI model...")

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are analyzing a civic issue report image. The user selected the category: "${category}".
              
This category typically includes: ${categoryDesc}

Please analyze the image and respond with ONLY ONE of these exact words:
- "MATCH" if the image clearly shows ${categoryDesc}
- "PARTIAL" if the image might be related but is unclear or ambiguous
- "NOMATCH" if the image does not show ${categoryDesc}

Respond with only one word: MATCH, PARTIAL, or NOMATCH`,
            },
            {
              type: "image",
              image: imageBase64,
            },
          ],
        },
      ],
    })

    console.log("[v0] AI response received:", text)

    const result = text.trim().toUpperCase()
    console.log("[v0] Parsed result:", result)

    return {
      success: true,
      result: result as "MATCH" | "PARTIAL" | "NOMATCH",
    }
  } catch (error) {
    console.error("[v0] Full error object:", error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to validate image",
    }
  }
}
