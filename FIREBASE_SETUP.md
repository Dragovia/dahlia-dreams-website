# Firebase Setup Guide for Dahlia Dreams

This guide will help you connect your Dahlia Dreams flower shop project to Google Firebase.

## Prerequisites

- A Google account
- Basic knowledge of web development

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "dahlia-dreams")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle the "Enable" switch
   - Click "Save"

## Step 3: Set Up Firestore Database

1. In your Firebase project console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

## Step 4: Get Your Firebase Configuration

1. In your Firebase project console, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to the "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "Dahlia Dreams Web")
6. Copy the Firebase configuration object

## Step 5: Update Your Configuration

1. Open the `firebase-config.js` file in your project
2. Replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};
```

## Step 6: Set Up Security Rules (Optional but Recommended)

1. In your Firestore Database, go to the "Rules" tab
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all products
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Only admins should write products
    }
    
    // Users can only read/write their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can create contact submissions
    match /contact_submissions/{submissionId} {
      allow create: if true;
      allow read, write: if false; // Only admins should read contact submissions
    }
  }
}
```

## Step 7: Test Your Setup

1. Open your project in a web browser
2. Try to sign up with a new account
3. Try to sign in with the created account
4. Try to add items to cart (should require authentication)
5. Check the Firebase console to see if data is being created

## Step 8: Deploy to Firebase Hosting (Optional)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init hosting
   ```

4. Deploy your project:
   ```bash
   firebase deploy
   ```

## Features Included

With this Firebase setup, your Dahlia Dreams project now includes:

### Authentication
- User registration and login
- Email/password authentication
- User session management
- Secure sign-out functionality

### Database (Firestore)
- Product catalog management
- User order tracking
- User profile storage
- Contact form submissions

### Real-time Features
- Live product updates
- Real-time order status
- User authentication state changes

## Troubleshooting

### Common Issues

1. **"Firebase not available" error**
   - Check that Firebase SDK scripts are loaded correctly
   - Verify your Firebase configuration is correct

2. **Authentication errors**
   - Ensure Email/Password authentication is enabled in Firebase console
   - Check that your Firebase config has the correct API key

3. **Database permission errors**
   - Verify your Firestore security rules
   - Check that you're in test mode or have proper rules set up

4. **CORS errors**
   - Add your domain to Firebase Authentication authorized domains
   - Check that your Firebase project settings are correct

### Getting Help

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)

## Security Notes

- Never commit your Firebase API keys to public repositories
- Use environment variables for production deployments
- Regularly review and update your Firestore security rules
- Monitor your Firebase usage and costs

## Next Steps

Once your Firebase setup is complete, you can:

1. Add more authentication methods (Google, Facebook, etc.)
2. Implement admin functionality for product management
3. Add payment processing with Stripe or PayPal
4. Set up email notifications for orders
5. Add real-time chat support
6. Implement inventory management
7. Add analytics and reporting features 