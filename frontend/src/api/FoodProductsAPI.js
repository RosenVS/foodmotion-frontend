import axios from 'axios';
const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const testConnection = async() => {
  return axios({
    method: 'GET',
    // url: 'https://foodmotion-api-gateway-6xxrfy77.ew.gateway.dev/api/food-product/test',
    url: 'https://foodmotion-food-products-service-hlfxsphkja-ew.a.run.app/api/food-product/test',
    // url: 'http://localhost:8080/api/food-product/test',
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
  });
};

export const fetchFoodProducts = () => {
  return axios({
    method: 'GET',
    // url: 'https://foodmotion-api-gateway-6xxrfy77.ew.gateway.dev/api/food-product',
    url: 'https://foodmotion-food-products-service-hlfxsphkja-ew.a.run.app/api/food-product',
    // url: 'http://localhost:8080/api/food-product',
    withCredentials: false,
    // headers: {
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${getAccessToken()}`
    // },
  });
};

export const deleteFoodProduct = (id) => {
  return axios({
    method: 'DELETE',
    // url: `https://foodmotion-api-gateway-6xxrfy77.ew.gateway.dev/api/food-product/${id}`,
    url: `https://foodmotion-food-products-service-hlfxsphkja-ew.a.run.app/api/food-product/${id}`,
    // url: `http://localhost:8080/api/food-product/${id}`,
    withCredentials: false,
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`
    },
  });
};

export const getFoodProduct = (id) => {
  return axios({
    method: 'GET',
    // url: `https://foodmotion-api-gateway-6xxrfy77.ew.gateway.dev/api/food-product/${id}`,
    url: `https://foodmotion-food-products-service-hlfxsphkja-ew.a.run.app/api/food-product/${id}`,
    // url: `http://localhost:8080/api/food-product/${id}`,
    withCredentials: false,
    // headers: {
    //   'Authorization': `Bearer ${getAccessToken()}`
    // },
  });
};

export const updateFoodProduct = (updatedProduct) => {
  return axios({
    method: 'PUT',
    // url: `https://foodmotion-api-gateway-6xxrfy77.ew.gateway.dev/api/food-product/${updatedProduct.id}`,
    url: `https://foodmotion-food-products-service-hlfxsphkja-ew.a.run.app/api/food-product/${updatedProduct.id}`,
    // url: `http://localhost:8080/api/food-product/${updatedProduct.id}`,
    withCredentials: false,
    data: updatedProduct,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
  });
};

export const createFoodProduct = (newProduct) => {
  return axios({
    method: 'POST',
    // url: `https://foodmotion-api-gateway-6xxrfy77.ew.gateway.dev/api/food-product`,
    url: `https://foodmotion-food-products-service-hlfxsphkja-ew.a.run.app/api/food-product`,
    // url: `http://localhost:8080/api/food-product`,
    withCredentials: false,
    data: newProduct,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessToken()}`
    },
  });
};