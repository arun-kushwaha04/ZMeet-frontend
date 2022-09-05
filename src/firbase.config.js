import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
 apiKey: 'AIzaSyAzZXiEl5H-pTO8CQLq-GLifzS36Roja48',
 authDomain: 'zmeet-5977f.firebaseapp.com',
 projectId: 'zmeet-5977f',
 storageBucket: 'zmeet-5977f.appspot.com',
 messagingSenderId: '725804213441',
 appId: '1:725804213441:web:03b4d3cdca482b8be2e040',
 measurementId: 'G-KHZTGW8D6X',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
