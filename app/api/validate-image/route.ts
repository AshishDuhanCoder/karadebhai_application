import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { imageData, category } = await request.json()

    if (!imageData || !category) {
      return NextResponse.json({ success: false, message: "Missing image data or category" }, { status: 400 })
    }

    console.log("[v0] Validating image for category:", category)

    // Execute Python script
    const command = `python3 scripts/validate_image.py "${imageData}" "${category}"`

    try {
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large images
      })

      if (stderr) {
        console.error("[v0] Python script stderr:", stderr)
      }

      console.log("[v0] Python script output:", stdout)

      // Parse JSON output from Python script
      const result = JSON.parse(stdout)

      return NextResponse.json(result)
    } catch (execError: any) {
      console.error("[v0] Error executing Python script:", execError)
      return NextResponse.json(
        {
          success: false,
          message: "Error analyzing image. Please try again.",
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("[v0] API route error:", error)
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 })
  }
}
