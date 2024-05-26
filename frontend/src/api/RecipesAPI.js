import axios from 'axios';
const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};



export const fetchRecipes = () => {
  return axios({
    method: 'GET',
    url: `https://foodmotion-recipes-service-hlfxsphkja-ew.a.run.app/api/recipes`,
    // url: 'http://localhost:8083/api/recipes',
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
  });
};

export const fetchRecipe = (id) => {
  return axios({
    method: 'GET',
    url: `https://foodmotion-recipes-service-hlfxsphkja-ew.a.run.app/api/recipes/${id}`,
    // url: `http://localhost:8083/api/recipes/${id}`,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
  });
};

export const fetchApprovedRecipes = () => {
  return axios({
    method: 'GET',
    url: `https://foodmotion-recipes-service-hlfxsphkja-ew.a.run.app/api/recipes/approved`,
    // url: 'http://localhost:8083/api/recipes/approved',
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
  });
};


export const updateRecipeStatus = (updatedRecipe) => {
    return axios({
      method: 'PUT',
      url: `https://foodmotion-food-products-service-hlfxsphkja-ew.a.run.app/api/food-product/recipe/status`,
      // url: `http://localhost:8080/api/food-product/recipe/status`,
      withCredentials: false,
      data: updatedRecipe,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      },
    });
  };



  export const fetchChefRecipes = () => {
    return axios({
      method: 'GET',
      url: `https://foodmotion-recipes-service-hlfxsphkja-ew.a.run.app/api/recipes/creator/${localStorage.getItem("UserUID")}`,
      // url: 'http://localhost:8083/api/recipes/creator/ujhLUcGPp3cujxTrkBjlW3nffEi2',
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      },
    });
  };


  export const updateRecipe = (recipe,id) => {
    return axios({
      method: 'PUT',
      url: `https://foodmotion-recipes-service-hlfxsphkja-ew.a.run.app/api/recipes/${id}`,
      // url: `http://localhost:8083/api/recipes/${id}`,
      withCredentials: false,
      data: recipe,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      },
    });
  };
  



  export const createRecipe = (recipe) => {
    return axios({
      method: 'POST',
      url: 'https://foodmotion-recipes-service-hlfxsphkja-ew.a.run.app/api/recipes',
      // url: `http://localhost:8083/api/recipes`,
      withCredentials: false,
      data: recipe,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessToken()}`
      },
    });
  };
  