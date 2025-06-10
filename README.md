# TalentMatch - AI-Powered Talent Matching Platform

A modern talent matching platform built with React, Convex, and TypeScript that connects talented professionals with amazing opportunities using intelligent matching algorithms.

## Features

- **Smart Matching Algorithm**: Automatically matches candidates with jobs based on skills, experience, and preferences
- **Real-time Updates**: Live updates using Convex's reactive database
- **Candidate Management**: Create and manage candidate profiles with skills, experience, and availability
- **Job Posting**: Post and manage job opportunities with detailed requirements
- **Interactive Dashboard**: Visual dashboard showing matches, statistics, and insights
- **Advanced Filtering**: Filter candidates and jobs by skills, location, experience level, and more
- **Authentication**: Secure user authentication with Convex Auth

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Convex (reactive database with real-time updates)
- **Authentication**: Convex Auth
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/roypushpak/talent-matching-mvp.git
cd talent-matching-mvp
```

2. Install dependencies:
```bash
npm install
```

3. Set up Convex:
```bash
npx convex dev
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/           # React components
│   ├── CandidatesList.tsx
│   ├── CreateCandidateForm.tsx
│   ├── CreateJobForm.tsx
│   ├── JobsList.tsx
│   ├── MatchingDashboard.tsx
│   └── TalentMatchingPlatform.tsx
├── App.tsx              # Main app component
└── main.tsx             # App entry point

convex/
├── schema.ts            # Database schema
├── candidates.ts        # Candidate-related functions
├── jobs.ts             # Job-related functions
├── matches.ts          # Matching algorithm functions
└── auth.ts             # Authentication setup
```

## Key Features

### Matching Algorithm
The platform uses a sophisticated matching algorithm that:
- Compares candidate skills with job requirements
- Weights required vs preferred skills differently
- Calculates match scores from 0-100%
- Filters out low-quality matches (< 20%)

### Real-time Updates
Built on Convex's reactive database, the platform provides:
- Live updates when new candidates or jobs are added
- Real-time match calculations
- Instant UI updates without manual refresh

### User Experience
- Clean, modern interface with Tailwind CSS
- Responsive design for all devices
- Intuitive navigation with tabbed interface
- Advanced filtering and search capabilities

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Convex](https://convex.dev) for the reactive backend
- UI components styled with [Tailwind CSS](https://tailwindcss.com)
- Icons and emojis for visual enhancement
