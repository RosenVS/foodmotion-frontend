import axios from 'axios';
const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  };

export const getNutrition = (request) => {
    return axios({
      method: 'POST',
      url: `https://foodmotion-api-gateway-6xxrfy77.ew.gateway.dev/api/daily-nutrition/user/date`,
      // url: `https://foodmotion-daily-nutrition-hlfxsphkja-ew.a.run.app/api/daily-nutrition/user/date`,
      // url: `http://localhost:8084/api/daily-nutrition/user/date`,
      withCredentials: false,
      data: request,
   
    });
  };
  
  export const createNewNutritionOfTheDay = (request) => {
    return axios({
      method: 'POST',
      url: `https://foodmotion-api-gateway-6xxrfy77.ew.gateway.dev/api/daily-nutrition`,
      // url: `https://foodmotion-daily-nutrition-hlfxsphkja-ew.a.run.app/api/daily-nutrition`,
      // url: `http://localhost:8084/api/daily-nutrition`,
      withCredentials: false,
      data: request,
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`
      },
    });
  };
  


export const removeFromNutrition = (id) => {
  return axios({
    method: 'DELETE',
    url: `https://foodmotion-api-gateway-6xxrfy77.ew.gateway.dev/api/daily-nutrition/${id}`,
    // url: `https://foodmotion-daily-nutrition-hlfxsphkja-ew.a.run.app/api/daily-nutrition/${id}`,
    // url: `http://localhost:8084/api/daily-nutrition/${id}`,
    withCredentials: false,
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`
    },
  });
};
