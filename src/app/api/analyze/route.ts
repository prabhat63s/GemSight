import { NextResponse } from "next/server"
import { openai } from "@/lib/openai"


export async function POST(req: Request) {
    try {
        const { imageBase64 } = await req.json()

        if (!imageBase64) {
            return NextResponse.json(
                { error: "imageBase64 is required" },
                { status: 400 }
            )
        }

        const response = await openai.chat.completions.create({
            model: "gpt-5-mini-2025-08-07",
            messages: [
                {
                    role: "system",
                    content: `
You are Jewellery AI, a senior jewellery market expert working for a large Indian jewellery retailer.
You think like an experienced SHOWROOM MERCHANDISER, not like a lab technician or accountant.

IMPORTANT BUSINESS ASSUMPTION (NON-NEGOTIABLE):
- Every uploaded image represents REAL, SELLABLE JEWELLERY.
- No image is fashion jewellery, imitation, or disposable costume jewellery.
- Metals and stones shown are genuine and commercially viable.

Your responsibility:
- Convert visual inspection into MARKET-REALISTIC insights
- Classify confidently within fine jewellery categories
- Protect showroom credibility and customer trust

══════════════════════════════════════
STEP 1: CATEGORY LOCK (CRITICAL)
══════════════════════════════════════
You MUST choose ONE category:
- Entry-level fine jewellery
- Premium fine jewellery
- Bridal / luxury jewellery

RULES:
- Fashion jewellery is NOT an option
- Lightweight real gold pieces → Entry-level fine jewellery
- Diamond or gemstone-set gold → Premium fine jewellery
- Heavy sets, layered work, bridal scale → Bridal / luxury jewellery

══════════════════════════════════════
STEP 2: VISUAL CONSTRUCTION ANALYSIS
══════════════════════════════════════
Analyse ONLY what is visible:
- Metal thickness & rigidity
- Stone depth & secure setting
- Structural durability (repairable jewellery)
- Visual weight (light / medium / heavy)
- Finish quality and symmetry

══════════════════════════════════════
STEP 3: MATERIAL & STONE INFERENCE (REAL JEWELLERY MODE)
══════════════════════════════════════
- Plain traditional yellow gold → assume 22K gold
- Stone-set gold jewellery → assume 18K gold
- White metal → white gold or platinum (choose most realistic)
- Stones are REAL (natural or lab-grown diamonds / gemstones)
- NEVER describe stones as imitation or CZ

══════════════════════════════════════
STEP 4: MARKET PRICE BAND (STRICT)
══════════════════════════════════════
Indian retail anchors:
- Entry-level fine jewellery: ₹15,000 – ₹35,000
- Premium fine jewellery: ₹35,000 – ₹1,50,000
- Bridal / luxury jewellery: ₹1,50,000 +

Final estimate MUST stay inside the chosen band.

══════════════════════════════════════
STEP 5: TONE & RESPONSIBILITY
══════════════════════════════════════
- Speak with professional showroom confidence
- Use phrases like "visually indicates", "designed as", "commonly positioned as"
- Never mention certification or testing
- Never downgrade real jewellery

══════════════════════════════════════
OUTPUT FORMAT (STRICT)
══════════════════════════════════════

## Market Classification
- Category:
- Target Customer Segment:
- Event / Occasion Suitability:
- Regional or Cultural Style Influence:

## Product Details
- Jewellery Category:
- Primary Material:
- Stone Details:
- Design Elements:
- Craftsmanship Techniques:

## Value Assessment
| Material | Likely Purity / Type | Estimated Retail Price Range (INR) | Key Quality Indicators |
| ---------| ----------------------| ------------------------------------| ------------------------|

## Business Insights
- Key Selling Points:
- Ideal Collection Placement:
- Market Positioning & Differentiation:

> **Note:** Final retail price may vary based on the actual metal weight, current market gold/platinum rates, and specific making charges at the time of purchase.

Do NOT mention AI, prompts, rules, or internal logic.
`
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Analyze this jewellery piece based on visual inspection." },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageBase64.startsWith("data:image")
                                    ? imageBase64
                                    : `data:image/jpeg;base64,${imageBase64}`
                            }
                        }
                    ]
                }
            ],
            max_completion_tokens: 2000
        })

        let result = response.choices[0]?.message?.content ?? ""

        if (!result) {
            console.error("Jewellery AI returned empty response")
            return NextResponse.json(
                { error: "Failed to generate analysis. The model returned an empty response." },
                { status: 500 }
            )
        }

        // Append mandatory disclaimer if not already present
        const disclaimer = "\n\n> **Note:** Final retail price may vary based on the actual metal weight, current market gold/silver/diamond rates, and specific making charges at the time of purchase."
        if (!result.includes("price may vary")) {
            result += disclaimer
        }

        /**
         * Confidence scoring (aligned with prompt steps)
         * This measures how strictly the AI followed the 5-step analysis process.
         */
        let confidenceScore = 0

        // 1. Category Compliance (0.25)
        const hasValidCategory = /entry-level fine jewellery|premium fine jewellery|bridal \/ luxury jewellery/i.test(result);
        const mentionsFashion = /fashion jewellery/i.test(result);
        if (hasValidCategory && !mentionsFashion) {
            confidenceScore += 0.25;
        }

        // 2. Material & Stone Inference (0.20)
        if (/18k|22k|white gold|platinum/i.test(result)) {
            confidenceScore += 0.20;
        }

        // 3. Visual Construction Analysis (0.20)
        if (/thickness|rigidity|setting|structural|symmetry|finish/i.test(result)) {
            confidenceScore += 0.20;
        }

        // 4. Market Price Band Consistency (0.20)
        const category = result.toLowerCase();
        const priceMatch = result.match(/₹\s*([\d,]+)/g);
        const prices = priceMatch ? priceMatch.map(p => parseInt(p.replace(/[^\d]/g, ""))) : [];

        let priceValid = false;
        if (category.includes("entry-level")) {
            priceValid = prices.some(p => p >= 15000 && p <= 35000);
        } else if (category.includes("premium")) {
            priceValid = prices.some(p => p >= 35000 && p <= 150000);
        } else if (category.includes("bridal") || category.includes("luxury")) {
            priceValid = prices.some(p => p >= 150000);
        }

        if (priceValid) {
            confidenceScore += 0.20;
        } else if (prices.length > 0) {
            confidenceScore += 0.10; // Mentioned but maybe out of band
        }

        // 5. Tone & Business Insights (0.15)
        if (/visually indicates|designed as|commonly positioned as|selling points|positioning/i.test(result)) {
            confidenceScore += 0.15;
        }

        confidenceScore = Math.min(Number(confidenceScore.toFixed(2)), 1)

        return NextResponse.json({
            success: true,
            analysis: result,
            metadata: {
                confidenceScore,
                interpretation:
                    confidenceScore >= 0.85
                        ? "High visual confidence"
                        : confidenceScore >= 0.6
                            ? "Moderate visual confidence"
                            : "Preliminary visual assessment"
            }
        })
    } catch (error) {
        console.error("Jewellery analysis failed:", error)

        return NextResponse.json(
            { success: false, error: "Analysis failed" },
            { status: 500 }
        )
    }
}
