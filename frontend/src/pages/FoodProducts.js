// import React, { useEffect, useState } from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import { fetchFoodProducts } from '../api/FoodProductsAPI';
// import { deleteFoodProduct } from '../api/FoodProductsAPI';
// import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// import CircularProgress from '@mui/material-next/CircularProgress';

// import '../css/foodProducts.css';
// const handleUpdate = (id) => {
//   // Handle update action
// };

// const handleDelete = (id) => {
//   // Handle delete action
// };

// const columns = [
//   { field: 'id', headerName: 'ID', width: 70 },
//   { field: 'name', headerName: 'Name', width: 200 },
//   { field: 'nutrition.protein.totalProtein', headerName: 'Total Protein', width: 150, valueGetter: (params) => params.row.nutrition?.protein?.totalProtein || '' },
//   { field: 'nutrition.carbs.totalCarbs', headerName: 'Total Carbs', width: 150, valueGetter: (params) => params.row.nutrition?.carbs?.totalCarbs || '' },
//   { field: 'nutrition.fat.totalFat', headerName: 'Total Fat', width: 150, valueGetter: (params) => params.row.nutrition?.fat?.totalFat || '' },
//   {
//     field: 'actions',
//     headerName: 'Actions',
//     width: 200,
//     renderCell: (params) => (
//       <strong>
//         <Button variant="contained" color="primary" onClick={() => handleUpdate(params.row.id)}>Update</Button>
//         <Button variant="contained" color="error" onClick={() => handleDelete(params.row.id)}>Delete</Button>
//       </strong>
//     )
//   },
// ];

// const DataTable = () => {
//   const [foodProducts, setFoodProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [openForm, setOpenForm] = useState(false);
//   const [formHandle, setFormHandle] = useState(false);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetchFoodProducts();
//         if (response != null) {
//           console.log(response.data)
//           const data = response.data.map(product => ({
//             ...product,
//             id: product.id,
//             name: product.name,
//             nutrition: product.nutrition,
//             actions: product.id // Just to include ID for demonstration purposes
//           }));
//           setFoodProducts(data);
//         }
//       } catch (error) {
//         console.error('Error fetching food products:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       // Make the DELETE request to delete the food product
//       await deleteFoodProduct(id);
  
//       // Remove the deleted product from the list
//       setFoodProducts(prevProducts => prevProducts.filter(product => product.id !== id));
//     } catch (error) {
//       console.error('Error deleting food product:', error);
//     } finally {
//       // Close the form
//       setOpenForm(false);
//     }
//   };

//   const handleCancel = () => {
//     // Close the form
//     setOpenForm(false);
//   };

//   const handleOpenForm = (id) => {
//     const product = foodProducts.find(item => item.id === id);
//     setSelectedProduct(product);
//     setOpenForm(true);
//   };

//   return (
//     <div>
//     <h1 className="centered-header">Food Products</h1>
//     <div className="centered-container">
//       {loading ? (
//         <div id='loadingAnimation'>
//           <CircularProgress color="tertiary" fourColor variant="indeterminate" />
//         </div>
//       ) : (
//         <div id='dataGrid'>
//           <DataGrid
//             rows={foodProducts}
//             columns={columns}
//             pageSize={5}
//             checkboxSelection={false}
//             onRowClick={(row) => handleOpenForm(row.id)}
//           />
//         </div>
//       )}
//     </div>

//     {/* Form Dialog */}
//     <Dialog open={openForm} onClose={() => setOpenForm(false)}>
//       <DialogTitle>Delete Food Product</DialogTitle>
//       <DialogContent>
//       <br />
//   <TextField label="ID" value={selectedProduct?.id || ''} fullWidth disabled />
//   <br /><br />
//   <TextField label="Name" value={selectedProduct?.name || ''} fullWidth disabled />
//   <br /><br />
//   <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
//     <TextField label="Total Protein" value={selectedProduct?.nutrition?.protein?.totalProtein || ''} fullWidth disabled />
//     <TextField label="Total Carbs" value={selectedProduct?.nutrition?.carbs?.totalCarbs || ''} fullWidth disabled />
//     <TextField label="Total Fat" value={selectedProduct?.nutrition?.fat?.totalFat || ''} fullWidth disabled />
//   </div>
//   <br />
//   <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
//     <TextField label="Gluten Free" value={selectedProduct?.dietaryRestrictions?.glutenFree ? 'Yes' : 'No'} disabled/>
//     <TextField label="Lactose Free" value={selectedProduct?.dietaryRestrictions?.lactoseFree ? 'Yes' : 'No'} disabled/>

//     <TextField label="Vegan" value={selectedProduct?.dietaryRestrictions?.vegan ? 'Yes' : 'No'} disabled/>
//     <TextField label="Vegetarian" value={selectedProduct?.dietaryRestrictions?.vegetarian ? 'Yes' : 'No'} disabled/>
//   </div>
// </DialogContent>


//       <DialogActions>
//       <Button variant="contained" color="error" onClick={(e) => handleDelete(selectedProduct?.id)}>Delete</Button>
//         <Button onClick={handleCancel} color="primary">Cancel</Button>
//       </DialogActions>
//     </Dialog>
//   </div>
//   );
// };

// export default DataTable;



import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { fetchFoodProducts,deleteFoodProduct,updateFoodProduct,createFoodProduct } from '../api/FoodProductsAPI';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CircularProgress from '@mui/material-next/CircularProgress';

import '../css/foodProducts.css';
import { create } from '@mui/material/styles/createTransitions';



const DataTable = () => {
  const [foodProducts, setFoodProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateProduct, setUpdateProduct] = useState(null);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({
    nutrition: {
      protein: {
        totalProtein: 0.0
      },
      carbs: {
        totalCarbs: 0.0,
        sugar: 0.0
      },
      fat: {
        totalFat: 0.0,
        transFat: 0.0
      }
    },
    dietaryRestrictions: {
      glutenFree: false,
      lactoseFree: false,
      vegan: false,
      vegetarian: false
    }
  });
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'nutrition.protein.totalProtein', headerName: 'Total Protein', width: 150, valueGetter: (params) => params.row.nutrition?.protein?.totalProtein || '' },
  { field: 'nutrition.carbs.totalCarbs', headerName: 'Total Carbs', width: 150, valueGetter: (params) => params.row.nutrition?.carbs?.totalCarbs || '' },
  { field: 'nutrition.fat.totalFat', headerName: 'Total Fat', width: 150, valueGetter: (params) => params.row.nutrition?.fat?.totalFat || '' },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 200,
    renderCell: (params) => (
      <strong>
        <Button variant="contained" color="primary" onClick={() => openUpdate(params.row.id)}>Update</Button>
        <Button variant="contained" color="error" onClick={() => openDelete(params.row.id)}>Delete</Button>
      </strong>
    )
  },
];
// const fetchData = async () => {
//   try {
//     const response = await fetchFoodProducts();
//     if (response != null) {

//       console.log(response.data)
//       const data = response.data.map(product => ({
//         ...product,
//         id: product.id,
//         name: product.name,
//         nutrition: product.nutrition,
//         actions: product.id // Just to include ID for demonstration purposes
//       }));
//       setFoodProducts(data);
//     }
//   } catch (error) {
//     console.error('Error fetching food products:', error);
//   } finally {
//     setLoading(false);
//   }
// };

const fetchData = async () => {
  fetchFoodProducts().then((response)=>{
    if(response != null){
      console.log(response)
      const data = response.data.map(product => ({
        ...product,
        id: product.id,
        name: product.name,
        nutrition: product.nutrition,
        actions: product.id // Just to include ID for demonstration purposes
      }));
      setFoodProducts(data);
    }
}).catch((e)=>{
})
setLoading(false);
};
  useEffect(() => {
    
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      // Make the DELETE request to delete the food product
      await deleteFoodProduct(id);
  
      // Remove the deleted product from the list
      setFoodProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting food product:', error);
    } finally {
      // Close the form
      handleCancel();
    }
  };
  
  const handleCreate = async (createProduct) => {
    console.log(createProduct)
    try {
      // Make the PUT request to update the food product
      await createFoodProduct(createProduct);
      
      fetchData();
    } catch (error) {
      console.error('Error creating food product:', error);
    } finally {
      // Close the form
      handleCancel();
    }
   
  };

  const handleUpdate = async (updatedProduct) => {
    console.log(updatedProduct)
    try {
      // Make the PUT request to update the food product
      await updateFoodProduct(updatedProduct);
      
      // Update the product in the list with the new values
      setFoodProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
    } catch (error) {
      console.error('Error updating food product:', error);
    } finally {
      // Close the form
      handleCancel();
    }
  };
 
  const handleCancel = () => {
    // Close the form
    setOpenDeleteForm(false);
    setOpenUpdateForm(false);
    setOpenCreateForm(false);
    setSelectedProduct(null);
  };

  const openDelete = (id) => {
    const product = foodProducts.find(item => item.id === id);
    setSelectedProduct(product);
    setOpenDeleteForm(true);
  };
  const openUpdate = (id) => {
    const product = foodProducts.find(item => item.id === id);
    setSelectedProduct(product);
    setUpdateProduct(product)
    setOpenUpdateForm(true);
  };

  
  // const handleProductChange = (e) => {
  //   e.persist();
  //   const { name, value } = e.target;
  //   setSelectedProduct(prevProduct => ({
  //     ...prevProduct,
  //     [name]: value
  //   }));
  // };
  const handleProductChange = (e) => {
    e.persist();
    const { name, value } = e.target;
  
    // Splitting nested field names by dot (.) to handle nested objects
    const fieldNames = name.split('.');
    
    // Function to recursively update nested fields
    const updateNestedFields = (obj, fields, val) => {
      const [currentField, ...remainingFields] = fields;
      
      // If there are no more nested fields, update the value
      if (remainingFields.length === 0) {
        return {
          ...obj,
          [currentField]: val
        };
      }
      
      // Otherwise, continue updating nested fields
      return {
        ...obj,
        [currentField]: updateNestedFields(obj[currentField], remainingFields, val)
      };
    };
  
    // Update the selectedProduct state with the new value for the specified nested field
    setSelectedProduct(prevProduct => updateNestedFields(prevProduct, fieldNames, value));
  };

  const handleCreateProductChange = (e) => {
    e.persist();
    const { name, value } = e.target;
  
    // Splitting nested field names by dot (.) to handle nested objects
    const fieldNames = name.split('.');
    
    // Function to recursively update nested fields
    const updateNestedFields = (obj, fields, val) => {
      const [currentField, ...remainingFields] = fields;
      
      // If there are no more nested fields, update the value
      if (remainingFields.length === 0) {
        return {
          ...obj,
          [currentField]: val
        };
      }
      
      // Otherwise, continue updating nested fields
      return {
        ...obj,
        [currentField]: updateNestedFields(obj[currentField], remainingFields, val)
      };
    };
  
    // Update the selectedProduct state with the new value for the specified nested field
    setUpdatedProduct(prevProduct => updateNestedFields(prevProduct, fieldNames, value));
  };
  return (
    <div>
    <h1 className="centered-header">Food Products</h1>
    <div className="centered-container">
      {loading ? (
        <div id='loadingAnimation'>
          <CircularProgress color="tertiary" fourColor variant="indeterminate" />
        </div>
      ) : (
        <div id='dataGrid'>
    <Button variant="contained" color="primary" onClick={() => setOpenCreateForm(true)}>Create Food Product</Button> 
  <br />
  <br />


          <DataGrid
            rows={foodProducts}
            columns={columns}
            pageSize={5}
            checkboxSelection={false}
            // onRowClick={(row) => handleOpenForm(row.id)}
          />
        </div>
      )}
    </div>

    {/* Delete Form Dialog */}
    <Dialog open={openDeleteForm} onClose={() => handleCancel()}>
      <DialogTitle>Delete Food Product</DialogTitle>
      <DialogContent>
      <br />
  <TextField label="ID" value={selectedProduct?.id || ''} fullWidth disabled />
  <br /><br />
  <TextField label="Name" value={selectedProduct?.name || ''} fullWidth disabled />
  <br /><br />
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <TextField label="Total Protein" value={selectedProduct?.nutrition?.protein?.totalProtein || ''} fullWidth disabled />
    <TextField label="Total Carbs" value={selectedProduct?.nutrition?.carbs?.totalCarbs || ''} fullWidth disabled />
    <TextField label="Total Fat" value={selectedProduct?.nutrition?.fat?.totalFat || ''} fullWidth disabled />
  </div>
  <br />
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <TextField label="Gluten Free" value={selectedProduct?.dietaryRestrictions?.glutenFree ? 'Yes' : 'No'} disabled/>
    <TextField label="Lactose Free" value={selectedProduct?.dietaryRestrictions?.lactoseFree ? 'Yes' : 'No'} disabled/>

    <TextField label="Vegan" value={selectedProduct?.dietaryRestrictions?.vegan ? 'Yes' : 'No'} disabled/>
    <TextField label="Vegetarian" value={selectedProduct?.dietaryRestrictions?.vegetarian ? 'Yes' : 'No'} disabled/>
  </div>
</DialogContent>


      <DialogActions>
      <Button variant="contained" color="error" onClick={(e) => handleDelete(selectedProduct?.id)}>Delete</Button>
        <Button onClick={handleCancel} color="primary">Cancel</Button>
      </DialogActions>
    </Dialog>

   {/* Update Form Dialog */}
    <Dialog open={openUpdateForm} onClose={() => handleCancel()}>
      <DialogTitle>Update Food Product</DialogTitle>
      <DialogContent>
  <br />
  <TextField label="ID" value={selectedProduct?.id || ''} fullWidth disabled />
  <br /><br />
  <TextField label="Name" value={selectedProduct?.name || ''} fullWidth onChange={handleProductChange} name="name" />
  <br /><br />
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <TextField label="Total Protein" value={selectedProduct?.nutrition?.protein?.totalProtein || ''} fullWidth onChange={handleProductChange} name="nutrition.protein.totalProtein" />
  </div>
  <br />
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <TextField label="Total Fat" value={selectedProduct?.nutrition?.fat?.totalFat || ''} fullWidth onChange={handleProductChange} name="nutrition.fat.totalFat" />
    <TextField label="Trans Fat" value={selectedProduct?.nutrition?.fat?.transFat || ''} fullWidth onChange={handleProductChange} name="nutrition.fat.transFat" />
  </div>
  <br />
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <TextField label="Total Carbs" value={selectedProduct?.nutrition?.carbs?.totalCarbs || ''} fullWidth onChange={handleProductChange} name="nutrition.carbs.totalCarbs" />
    <TextField label="Sugar" value={selectedProduct?.nutrition?.carbs?.sugar || ''} fullWidth onChange={handleProductChange} name="nutrition.carbs.sugar" />
  </div>
  <br />
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <TextField label="Gluten Free" value={selectedProduct?.dietaryRestrictions?.glutenFree ? 'Yes' : 'No'} onChange={handleProductChange} name="dietaryRestrictions.glutenFree" />
    <TextField label="Lactose Free" value={selectedProduct?.dietaryRestrictions?.lactoseFree ? 'Yes' : 'No'} onChange={handleProductChange} name="dietaryRestrictions.lactoseFree" />
    <TextField label="Vegan" value={selectedProduct?.dietaryRestrictions?.vegan ? 'Yes' : 'No'} onChange={handleProductChange} name="dietaryRestrictions.vegan" />
    <TextField label="Vegetarian" value={selectedProduct?.dietaryRestrictions?.vegetarian ? 'Yes' : 'No'} onChange={handleProductChange} name="dietaryRestrictions.vegetarian" />
  </div>
</DialogContent>


      <DialogActions>
      <Button variant="contained" color="error" onClick={(e) => handleUpdate(selectedProduct)}>Update</Button>
        <Button onClick={handleCancel} color="primary">Cancel</Button>
      </DialogActions>
    </Dialog>

    {/* Create Form Dialog */}
    <Dialog open={openCreateForm} onClose={() => handleCancel()}>
      <DialogTitle>Create Food Product</DialogTitle>
      <DialogContent>
  <br /><br />
  <TextField label="Name" value={updatedProduct?.name || ''} fullWidth onChange={handleCreateProductChange} name="name" />
  <br /><br />
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <TextField label="Total Protein" value={updatedProduct?.nutrition?.protein?.totalProtein || ''} fullWidth onChange={handleCreateProductChange} name="nutrition.protein.totalProtein" />
  </div>
  <br />
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <TextField label="Total Fat" value={updatedProduct?.nutrition?.fat?.totalFat || ''} fullWidth onChange={handleCreateProductChange} name="nutrition.fat.totalFat" />
    <TextField label="Trans Fat" value={updatedProduct?.nutrition?.fat?.transFat || ''} fullWidth onChange={handleCreateProductChange} name="nutrition.fat.transFat" />
  </div>
  <br />
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <TextField label="Total Carbs" value={updatedProduct?.nutrition?.carbs?.totalCarbs || ''} fullWidth onChange={handleCreateProductChange} name="nutrition.carbs.totalCarbs" />
    <TextField label="Sugar" value={updatedProduct?.nutrition?.carbs?.sugar || ''} fullWidth onChange={handleCreateProductChange} name="nutrition.carbs.sugar" />
  </div>
  <br />
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <TextField label="Gluten Free" value={updatedProduct?.dietaryRestrictions?.glutenFree} onChange={handleCreateProductChange} name="dietaryRestrictions.glutenFree" />
    <TextField label="Lactose Free" value={updatedProduct?.dietaryRestrictions?.lactoseFree} onChange={handleCreateProductChange} name="dietaryRestrictions.lactoseFree" />
    <TextField label="Vegan" value={updatedProduct?.dietaryRestrictions?.vegan } onChange={handleCreateProductChange} name="dietaryRestrictions.vegan" />
    <TextField label="Vegetarian" value={updatedProduct?.dietaryRestrictions?.vegetarian} onChange={handleCreateProductChange} name="dietaryRestrictions.vegetarian" />
  </div>
</DialogContent>


      <DialogActions>
      <Button variant="contained" color="error" onClick={(e) => handleCreate(updatedProduct)}>Create</Button>
        <Button onClick={handleCancel} color="primary">Cancel</Button>
      </DialogActions>
    </Dialog>
  </div>

  
  );
};

export default DataTable;









