# Live Collaborative AI Editor

A real-time collaborative editor with AI assistance, featuring:

- Text/code editor
- Right-hand AI chat panel
- Selection-based floating toolbar with AI actions
- Direct AI modification of editor content

## Features

### 1. Code Editor
- Based on CodeMirror
- Syntax highlighting for JavaScript/TypeScript
- Selection-based toolbar

### 2. AI Chat
- Right-hand sidebar chat panel
- Send messages to AI assistant
- AI can modify editor content directly

### 3. Floating Toolbar
- Appears when text is selected
- Quick AI actions:
  - Shorten text
  - Lengthen text
  - Convert to table
  - Fix grammar
  - Format text
  - Convert to bullet list

## Tech Stack

- **Framework**: Next.js with App Router
- **UI Components**: Tailwind CSS and shadcn/ui
- **Editor**: CodeMirror (via @uiw/react-codemirror)
- **AI Integration**: OpenAI API

## Setup Instructions

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env.local` file with your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key
```
4. Run the development server:
```bash
npm run dev
```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The project is ready to deploy on Vercel or Netlify:

1. Push to GitHub
2. Connect to Vercel/Netlify
3. Configure the OPENAI_API_KEY environment variable
4. Deploy

## Implementation Notes

- This is a prototype/demo implementation
- Uses client-side OpenAI API calls with the `dangerouslyAllowBrowser` flag for simplicity
- For production, move API calls to server-side endpoints
- AI responses use a special format to separate chat responses from editor modifications
