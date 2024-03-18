import axios from 'axios';

// const getToken=()=>{
//   return localStorage.getItem('USER_KEY');
// }

// LocalHost -----------------------------------------------
// export  const fetchFoodProducts=()=>{
//     return axios({
//         method:'GET',
//         url:`${process.env.hostUrl||'http://localhost:8080'}/api/food-product`,
//         headers:{
//       }
//     })
// }
// export const deleteFoodProduct = (id) => {
//   return axios({
//     method: 'DELETE',
//     url: `${process.env.hostUrl || 'http://localhost:8080'}/api/food-product/${id}`,
//     headers: {
//       // Add any headers if needed
//     }
//   });
// };

// export const updateFoodProduct = (updatedProduct) => {
//   return axios({
//     method: 'PUT',
//     url: `${process.env.hostUrl || 'http://localhost:8080'}/api/food-product/${updatedProduct.id}`,
//     data: updatedProduct,
//     headers: {
//       // Add headers if needed
//     }
//   });
// };
// export const createFoodProduct = (updatedProduct) => {
//   return axios({
//     method: 'POST',
//     url: `${process.env.hostUrl || 'http://localhost:8080'}/api/food-product`,
//     data: updatedProduct,
//     headers: {
//       // Add headers if needed
//     }
//   });
// };




// API-Gateway -----------------------------------------------
// export  const fetchFoodProducts=()=>{
//     return axios({
//         method:'GET',
//         url:`${process.env.hostUrl||'http://localhost:8080'}/api/food-product`,
//         headers:{
//       }
//     })
// }
// export const deleteFoodProduct = (id) => {
//   return axios({
//     method: 'DELETE',
//     url: `${process.env.hostUrl || 'http://localhost:8080'}/api/food-product/${id}`,
//     headers: {
//       // Add any headers if needed
//     }
//   });
// };

// export const updateFoodProduct = (updatedProduct) => {
//   return axios({
//     method: 'PUT',
//     url: `${process.env.hostUrl || 'http://localhost:8080'}/api/food-product/${updatedProduct.id}`,
//     data: updatedProduct,
//     headers: {
//       // Add headers if needed
//     }
//   });
// };
// export const createFoodProduct = (updatedProduct) => {
//   return axios({
//     method: 'POST',
//     url: `${process.env.hostUrl || 'http://localhost:8080'}/api/food-product`,
//     data: updatedProduct,
//     headers: {
//       // Add headers if needed
//     }
//   });
// };



// Cloud-Run -----------------------------------------------
export  const fetchFoodProducts=()=>{
  return axios({
      method:'GET',
      url:`https://foodmotion-food-products-service-ud3f4nfe5a-ew.a.run.app/api/food-product`,
      withCredentials: false,
     
  })
}
export const deleteFoodProduct = (id) => {
return axios({
  method: 'DELETE',
  url: `/api/food-product/${id}`,
  withCredentials: false,

});
};

export const updateFoodProduct = (updatedProduct) => {
return axios({
  method: 'PUT',
  url: `/api/food-product/${updatedProduct.id}`,
  withCredentials: false,
  data: updatedProduct,
 
});
};
export const createFoodProduct = (updatedProduct) => {
return axios({
  method: 'POST',
  url: `/api/food-product`,
  withCredentials: false,
  data: updatedProduct,

});
};
