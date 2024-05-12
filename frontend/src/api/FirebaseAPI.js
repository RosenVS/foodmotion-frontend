import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { database } from "../config/FirebaseConfig";
import axios from 'axios';
const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(database, email, password);
    const user = userCredential.user;
    console.log("Sign-in successful:", user.stsTokenManager.accessToken);
    // Decode the JWT token
    const decodedToken = parseJwt(user.stsTokenManager.accessToken);

    // Extract user ID from decoded token
    const userId = decodedToken.user_id;
    console.log("UserID:", userId);


    localStorage.setItem("accessToken", user.stsTokenManager.accessToken);
    localStorage.setItem("UserUID", userId);
    return user;
  } catch (error) {
    console.error("Sign-in error:", error.code);
    throw error;
  }
};

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}
// export const signUp2 = async (email, password) => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(database, email, password);
//     const user = userCredential.user;
//     console.log("Sign-up successful:", user.stsTokenManager.accessToken);
//     localStorage.setItem("accessToken", user.stsTokenManager.accessToken);

//     return user;
//   } catch (error) {
//     console.error("Sign-up error:", error.code);
//     throw error;
//   }
// };



// The signUp2 function creates a new user and sets custom claims for that user


const getUserUID = () => {
  return localStorage.getItem("UserUID");
};


export const fetchAccountData = (id) => {
  return axios({
    method: 'GET',
    url: `http://localhost:8082/api/account/${getUserUID()}`,
    withCredentials: false,
   
  });
};


export const signUp = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8081/api/firebase/signup', {
        email: email,
        password: password
      });
      
      const accessToken = response;
      console.log("Sign-up successful:", accessToken);
      signIn(email,password)
    } catch (error) {
      console.error("Sign-up error:", error.response.status);
      throw error;
    }
  };
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(getAuth(), email);
    console.log("Password reset email sent.");
  } catch (error) {
    console.error("Password reset error:", error.message);
    throw error;
  }
};



export const updatePersonalDetails = (personalData) => {
  return axios({
    method: 'POST',
    url: `http://localhost:8082/api/account/personal_data`,
    withCredentials: false,
    data: personalData,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
  });
};


export const updateDietGoal = (dietGoal) => {
  return axios({
    method: 'POST',
    url: `http://localhost:8082/api/account/diet_goal`,
    withCredentials: false,
    data: dietGoal,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
  });
};


export const updateUserRestrictions = (restrictions) => {
  return axios({
    method: 'POST',
    url: `http://localhost:8082/api/account/diet_restrictions`,
    withCredentials: false,
    data: restrictions,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
  });
};

export const deleteAccount = (user) => {
  return axios({
    method: 'DELETE',
    url: `http://localhost:8082/api/account`,
    withCredentials: false,
    data: user,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
  });
};