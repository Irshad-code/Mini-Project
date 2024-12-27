# Feature Modules

This directory contains isolated feature modules that can be developed independently by different developers.

## Structure

Each feature module follows this structure:

```
feature-name/
├── index.jsx           # Main entry point and exports
├── FeatureComponent.jsx # Main feature component
├── components/         # Feature-specific components
├── hooks/             # Feature-specific hooks
├── utils/             # Feature-specific utilities
├── api/               # Feature-specific API calls
└── types/             # Feature-specific TypeScript types
```

## Features

1. Staff Information (`staffInfo/`)
   - Personal information
   - Academic information
   - Research activities

2. Tax Management (`taxManagement/`)
   - Form 16
   - Declarations
   - Investments

3. Scheduling (`scheduling/`)
   - Timetable
   - Assignments
   - Events

4. Question Papers (`questionPapers/`)
   - Create
   - Review
   - Archive

5. Course Files (`courseFiles/`)
   - Materials
   - Syllabus
   - Resources

6. Attendance (`attendance/`)
   - Mark attendance
   - Reports
   - Analytics

## Development Guidelines

1. Each feature should be self-contained
2. Use lazy loading for optimal performance
3. Keep shared components in the main components directory
4. Follow the established project structure
5. Document your code and APIs
