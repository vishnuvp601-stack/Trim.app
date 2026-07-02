# Trim Frontend

A Next.js-based file converter UI for architects, built with React, Tailwind CSS, and Lucide Icons.

## Design Language

- **Apple Liquid Glass**: Minimalist, high-end aesthetic
- **Backdrop Filter**: blur(20px) for glass effect
- **Colors**: Semi-transparent white overlays (rgba(255, 255, 255, 0.2))
- **Border Radius**: 24px throughout
- **Grid System**: 8px multiples for perfect alignment

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Framework**: React 18
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── globals.css          # Global styles & glass utilities
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
├── components/
│   └── UploadCard.tsx       # Main upload component with 3 states
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Component States

### UploadCard Component

The `UploadCard` component has three UI states:

1. **Idle**: Waiting for file upload
   - Drag-and-drop zone with visual feedback
   - Click to browse functionality
   - Supports PPT, PPTX, DOC, DOCX files

2. **Uploading**: Processing file
   - Sleek progress indicator
   - File name display
   - Real-time progress percentage

3. **Success**: Conversion complete
   - Download button for PDF
   - Convert Another button to reset

## Placeholder Functions

- `onFileSelect()`: Called when file is selected (integration point for backend upload)
- `handleDownload()`: Placeholder for PDF download logic

## Next Steps

- Phase 2: Integration with Supabase presigned URLs
- Phase 3: Backend Python worker setup
- Phase 4: Real-time conversion status updates
