import axios from 'axios';

// const getToken=()=>{
//   return localStorage.getItem('USER_KEY');
// }
export  const fetchFoodProducts=()=>{
    return axios({
        method:'GET',
        url:`${process.env.hostUrl||'http://localhost:8080'}/api/food-product`,
        headers:{
      }
    })
}
export const deleteFoodProduct = (id) => {
  return axios({
    method: 'DELETE',
    url: `${process.env.hostUrl || 'http://localhost:8080'}/api/food-product/${id}`,
    headers: {
      // Add any headers if needed
    }
  });
};

export const updateFoodProduct = (updatedProduct) => {
  return axios({
    method: 'PUT',
    url: `${process.env.hostUrl || 'http://localhost:8080'}/api/food-product/${updatedProduct.id}`,
    data: updatedProduct,
    headers: {
      // Add headers if needed
    }
  });
};
export const createFoodProduct = (updatedProduct) => {
  return axios({
    method: 'POST',
    url: `${process.env.hostUrl || 'http://localhost:8080'}/api/food-product`,
    data: updatedProduct,
    headers: {
      // Add headers if needed
    }
  });
};
