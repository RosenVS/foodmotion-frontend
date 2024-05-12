// import { initializeApp } from "firebase/app";
// import { getAuth } from 'firebase/auth'

// const firebaseConfig = {
//   apiKey: "AIzaSyCurHoYLaFLGnEMh6Rzb3s3eRtTyRy7O1I",
//   authDomain: "googleapis.com",
//   projectId: "root-fort-412616",
//   storageBucket: "firebase-adminsdk-jeeey@root-fort-412616.iam.gserviceaccount.com",
//   messagingSenderId: "808772455307",
//   appId: "1:808772455307:web:bb91cfd157cc7c046efd8e"
// };

// const app = initializeApp(firebaseConfig);
// export const database = getAuth(app)


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCurHoYLaFLGnEMh6Rzb3s3eRtTyRy7O1I",
  authDomain: "root-fort-412616.firebaseapp.com",
  projectId: "root-fort-412616",
  storageBucket: "root-fort-412616.appspot.com",
  messagingSenderId: "647460229344",
  appId: "1:647460229344:web:4d14b7237f0455efd84085",
  measurementId: "G-PGV54ZF0BD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getAuth(app);