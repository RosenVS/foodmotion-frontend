/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addCustomClaimsOnUserCreation = functions.auth.user().onCreate(async (user) => {
  try {
    // Get user's email
    const email = user.email;

    // Add custom claims based on email
    let customClaims = {};
    if (email) {
        customClaims = {
          user: true,
          read: true
        };
    }

    // Set custom claims
    await admin.auth().setCustomUserClaims(user.uid, customClaims);

    return console.log('Custom claims added for user:', user.uid);
  } catch (error) {
    console.error('Error adding custom claims:', error);
    throw new functions.https.HttpsError('internal', 'Error adding custom claims');
  }
});
