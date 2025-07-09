# Firebase Emulator Setup Guide

This guide explains how to use Firebase emulators for local development with your Dahlia Dreams project.

## What are Firebase Emulators?

Firebase emulators allow you to run Firebase services locally on your machine, providing:
- **Offline development** - No internet connection required
- **Fast development** - No network latency
- **Safe testing** - No risk of affecting production data
- **Cost-free development** - No Firebase usage charges during development

## Prerequisites

1. **Node.js** (version 14 or higher)
2. **Firebase CLI** (already installed via `firebase-tools` in package.json)

## Quick Start

### 1. Start the Emulators

```bash
npm run emulators
```

This will start:
- **Auth Emulator** on `http://localhost:9099`
- **Firestore Emulator** on `http://localhost:8080`
- **Hosting Emulator** on `http://localhost:5000`
- **Emulator UI** on `http://localhost:4000`

### 2. Access Your Application

Open your browser and navigate to:
- **Your App**: `http://localhost:5000`
- **Emulator UI**: `http://localhost:4000` (for debugging and data management)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run emulators` | Start all emulators |
| `npm run emulators:export` | Export emulator data to `./emulator-data` |
| `npm run emulators:import` | Start emulators with imported data |
| `npm run emulators:clean` | Start emulators and export data on exit |

## Emulator UI Features

The Emulator UI (http://localhost:4000) provides:

### Authentication
- View and manage users
- Create test users
- Monitor authentication events
- Test different auth providers

### Firestore
- Browse collections and documents
- Add/edit/delete data
- View real-time updates
- Export/import data

## Development Workflow

### 1. Starting Development
```bash
# Start emulators
npm run emulators

# In another terminal, start your app (if needed)
npm start
```

### 2. Working with Data
- Use the Emulator UI to create test data
- Your app will automatically connect to emulators when running on localhost
- All Firebase operations will be performed locally

### 3. Persisting Data Between Sessions
```bash
# Export current emulator data
npm run emulators:export

# Start with saved data
npm run emulators:import
```

### 4. Clean Development
```bash
# Start fresh each time, but save data on exit
npm run emulators:clean
```

## Configuration Details

### Firebase Configuration (`firebase-config.js`)
The configuration automatically detects when running locally and connects to emulators:

```javascript
// Automatically connects to emulators on localhost
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    auth.useEmulator('http://localhost:9099');
    db.useEmulator('localhost', 8080);
}
```

### Emulator Ports (`firebase.json`)
- **Auth**: 9099
- **Firestore**: 8080
- **Hosting**: 5000
- **UI**: 4000

## Best Practices

### 1. Data Management
- Use the Emulator UI to set up realistic test data
- Export data regularly to maintain consistent test scenarios
- Consider creating different data sets for different test scenarios

### 2. Development Workflow
- Always use emulators for local development
- Test with production data structure
- Use the Emulator UI to debug authentication and database issues

### 3. Testing
- Create test users in the Auth emulator
- Set up test data in Firestore emulator
- Test all Firebase operations locally before deploying

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill processes using the ports
   npx kill-port 9099 8080 5000 4000
   ```

2. **Emulators Not Starting**
   ```bash
   # Clear Firebase cache
   firebase logout
   firebase login
   ```

3. **App Not Connecting to Emulators**
   - Ensure you're accessing via `localhost` or `127.0.0.1`
   - Check browser console for connection messages
   - Verify emulators are running on correct ports

### Debugging Tips

1. **Check Console Logs**
   - Look for "Connected to Auth emulator" and "Connected to Firestore emulator" messages
   - Monitor for any connection errors

2. **Use Emulator UI**
   - Check Authentication tab for user management
   - Use Firestore tab to verify data operations
   - Monitor real-time updates

3. **Network Tab**
   - Verify requests are going to localhost ports
   - Check for any failed requests to production Firebase

## Production Deployment

When ready to deploy:

1. **Stop emulators** (Ctrl+C in terminal)
2. **Deploy to production**:
   ```bash
   npm run deploy
   ```

Your app will automatically use production Firebase services when not running on localhost.

## Additional Resources

- [Firebase Emulator Documentation](https://firebase.google.com/docs/emulator-suite)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Emulator UI Guide](https://firebase.google.com/docs/emulator-suite/install_and_configure#ui) 