# Daily Task Scheduler

A production-ready, full-stack task management application built with React, TypeScript, Firebase, and OpenAI integration.

## Features

- **Authentication**: Email/password and Google Sign-In
- **Task Management**: Create, edit, delete, and toggle task completion
- **Priority System**: High, medium, and low priority levels
- **Calendar View**: Month and week views with task visualization
- **AI Suggestions**: Get personalized task recommendations using OpenAI
- **Real-time Updates**: Live synchronization across devices
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Security**: Firestore security rules and user data isolation

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Auth, Firestore, Functions)
- **AI**: OpenAI GPT-3.5-turbo
- **Build Tool**: Vite
- **Testing**: Vitest
- **Deployment**: Firebase Hosting
- **CI/CD**: GitHub Actions

## Prerequisites

- Node.js 18+
- Firebase CLI
- Firebase project with Authentication, Firestore, and Functions enabled
- OpenAI API key

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd daily-task-scheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase and OpenAI credentials in `.env`

4. **Update Firebase configuration**
   - Update `.firebaserc` with your Firebase project ID
   - Set OpenAI API key in Firebase Functions config:
     ```bash
     firebase functions:config:set openai.key="your-openai-api-key"
     ```

5. **Start Firebase emulators**
   ```bash
   firebase emulators:start
   ```

6. **Start the development server** (in a new terminal)
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Firebase UI: http://localhost:4000

## Testing

Run the test suite:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

## Deployment

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### Automated Deployment (GitHub Actions)

1. **Set up GitHub Secrets**
   Add the following secrets to your GitHub repository:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_OPENAI_API_KEY`
   - `FIREBASE_TOKEN` (get with `firebase login:ci`)

2. **Push to main branch**
   ```bash
   git push origin main
   ```

The GitHub Action will automatically build, test, and deploy your application.

## Project Structure

```
daily-task-scheduler/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── calendar/       # Calendar view components
│   │   ├── tasks/          # Task management components
│   │   └── ui/             # Reusable UI components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   └── tests/              # Test files
├── functions/              # Firebase Cloud Functions
├── public/                 # Static assets
├── .github/workflows/      # GitHub Actions
├── firebase.json           # Firebase configuration
├── firestore.rules        # Firestore security rules
└── firestore.indexes.json # Firestore indexes
```

## Firebase Configuration

### Authentication
- Email/password authentication enabled
- Google Sign-In provider configured
- User profile management

### Firestore Database
- Collection: `tasks` - stores user tasks
- Collection: `users` - stores user profiles
- Security rules enforce user data isolation
- Indexes optimize query performance

### Cloud Functions
- `getTasks` - Retrieve user tasks
- `createTask` - Create new task
- `updateTask` - Update existing task
- `deleteTask` - Delete task
- `getAISuggestion` - Get AI-powered task suggestions

### Security Rules
- Users can only access their own data
- All operations require authentication
- Data validation on writes

## Environment Variables

### Frontend (.env)
- `VITE_FIREBASE_*` - Firebase configuration
- `VITE_OPENAI_API_KEY` - OpenAI API key

### Functions
- `openai.key` - OpenAI API key (set via Firebase CLI)

## API Endpoints

All endpoints are Firebase Cloud Functions:

- `getTasks()` - Get user's tasks
- `createTask(data)` - Create a new task
- `updateTask(taskId, updates)` - Update a task
- `deleteTask(taskId)` - Delete a task
- `getAISuggestion()` - Get AI task recommendation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.