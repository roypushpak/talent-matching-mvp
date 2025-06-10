#!/bin/bash

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: TalentMatch - AI-Powered Talent Matching Platform

Features:
- Smart matching algorithm for candidates and jobs
- Real-time updates with Convex
- Candidate and job management
- Interactive dashboard with statistics
- Advanced filtering and search
- Secure authentication
- Modern React + TypeScript + Tailwind CSS UI"

# Add GitHub remote
git remote add origin https://github.com/roypushpak/talent-matching-mvp.git

# Push to GitHub
git branch -M main
git push -u origin main

echo "Successfully pushed to GitHub!"
echo "Repository: https://github.com/roypushpak/talent-matching-mvp"
