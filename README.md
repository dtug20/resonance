# TexTone

TexTone is a robust, full-stack AI web application tailored for advanced text-to-speech generation and audio processing. The platform bridges custom cloud-based AI models with a seamless, highly interactive user interface to deliver a production-ready audio experience.

Live Application: https://www.textone.id.vn (Deployed via Cloudflare)

## Features

* Advanced Audio Processing: Real-time audio recording, playback, and visual waveform rendering.
* Custom AI Integration: Configured and served custom machine learning models utilizing Modal infrastructure, alongside the OpenAI API for intelligent text-to-speech capabilities.
* Secure Authentication: Comprehensive user identity management and protected routes.
* Scalable Cloud Storage: Efficient storage and retrieval of generated audio files using object storage.
* End-to-End Type Safety: Fully typed API layer connecting the client and server for reliable data fetching and mutations.

## Tech Stack

### Frontend
* Framework: Next.js and React 19
* Styling: Tailwind CSS v4, Radix UI
* Audio Handling: Wavesurfer.js, RecordRTC
* State & Data Fetching: TanStack React Query

### Backend
* API Layer: tRPC
* Database: PostgreSQL
* ORM: Prisma
* Authentication: Clerk

### Infrastructure & AI
* Deployment: Cloudflare
* Cloud Storage: AWS S3
* AI Model Hosting: Modal (for custom models), OpenAI API

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
* Node.js (version 20 or higher recommended)
* PostgreSQL instance
* Accounts for Clerk, AWS (S3), Modal, and OpenAI

## Getting Started

1. Clone the repository
```bash
git clone <your-repository-url>
cd textone1
Install dependencies
```

2. Install dependencies

```bash
npm install
```

3. Configure Environment Variables
Create a .env file in the root directory and add the necessary configuration keys. You will need to provide keys for your Database URL, Clerk Authentication, AWS S3, OpenAI, and Modal configurations.

4. Setup the Database
Generate the Prisma client and push the schema to your PostgreSQL database:

```bash
npm run postinstall
npx prisma db push
```

5. Run the Development Server
Start the Next.js development server:

```bash
npm run dev
```
Open http://localhost:3000 in your browser to view the application.

## Deployment
This application is configured for deployment on Cloudflare. Ensure your build commands and output directories align with Cloudflare Pages/Workers requirements. The database must be accessible externally, and all environment variables must be securely added to your Cloudflare dashboard.

Custom AI models are hosted independently on Modal and communicate with the main application via API endpoints.
