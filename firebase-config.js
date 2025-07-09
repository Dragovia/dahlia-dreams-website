// Firebase configuration
// Replace with your own Firebase config object
const firebaseConfig = {
    apiKey: "AIzaSyA1ru1mGR7w6k_iLLhI2yt6J37Duz5clXE",
    authDomain: "dahlia-dreams.firebaseapp.com",
    projectId: "dahlia-dreams",
    storageBucket: "dahlia-dreams.firebasestorage.app",
    messagingSenderId: "753175559313",
    appId: "1:753175559313:web:34a223b0d59907ba929330",
    measurementId: "G-73MMSQNJ0Q"
  };

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
    
    // Initialize Firebase services
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    // Connect to emulators if running locally
    // Temporarily disabled until Java is installed
    /*
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Connect to Auth emulator
        auth.useEmulator('http://localhost:9099');
        console.log('Connected to Auth emulator on localhost:9099');
        
        // Connect to Firestore emulator
        db.useEmulator('localhost', 8080);
        console.log('Connected to Firestore emulator on localhost:8080');
    }
    */
    
    // Export for use in other files
    window.auth = auth;
    window.db = db;
    
    console.log('Firebase services initialized');
} catch (error) {
    console.error('Error initializing Firebase:', error);
} 