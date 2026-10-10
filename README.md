# 💎 GemSight

**Turn your camera into an expert appraiser.** Using GPT-4o Vision, GemSight identifies fine details and generates professional, certificate-ready PDF reports instantly.


GemSight is a premium, expert-level jewellery appraisal and metadata generation platform powered by advanced AI. This system provides instant visual intelligence for high-resolution jewellery images, thinking like a senior showroom merchandiser.


## ✨ Key Features

- **🤖 AI Expert System**: Uses a specialized "Showroom Merchandiser" persona to provide market-realistic insights rather than just technical descriptions.
- **🎯 Confidence Scoring**: Real-time reasoning confidence levels (High, Medium, Preliminary) based on visual evidence like setting methods, material thickness, and structural integrity.
- **📸 Multi-Source Input**:
  - High-resolution file uploads.
  - Integrated live camera system with overlay grids for perfect alignment.
- **📄 Professional PDF Export**: Generate branded, certificate-style PDF reports on the server with:
  - Subject evidence previews.
  - Structured value assessment tables.
  - Business-ready market insights.
- **📜 Analysis History**: Local persistence of the last 5 analyses, including full reports and confidence metadata.
- **🎨 Premium UI/UX**:
  - Clean light theme with a serif display face and an emerald accent.
  - Responsive layout optimized for both desktop and mobile field use.

## 🧠 How It Works

The system doesn't just "see" an image; it analyzes it through the lens of a **Senior Jewellery Merchandiser**:

1. **Category Lock**: Classifies pieces into Fashion, Entry-level, Premium, or Bridal segments.
2. **Visual Construction**: Inspects metal thickness, stone depth, and setting methods (e.g., prong vs. glue).
3. **Material Inference**: Makes educated assessments of purity (18K/22K) and metal types based on visual cues.
4. **Market Anchoring**: Estimates retail price ranges based on current Indian market benchmarks.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.1.6](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **AI Engine**: OpenAI GPT-4o (Vision)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jspdf-autotable)
- **Content**: [React Markdown](https://github.com/remarkjs/react-markdown) with GFM support.
- **Language**: TypeScript

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/prabhat63s/GemSight.git
cd GemSight
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📄 PDF Reports

The system generates professional reports including:

- Subject Evidence (High-res image preview)
- Appraisal Summary
- Detailed Market Classification
- Value Assessment (Structured tables)
- Business Insights

---
