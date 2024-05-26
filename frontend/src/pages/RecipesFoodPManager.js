// import React, { useEffect, useState } from 'react';
// import { Grid, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
// import { fetchRecipes, updateRecipeStatus } from '../api/RecipesAPI';
// import { DataGrid } from '@mui/x-data-grid';
// import Pagination from '@mui/material/Pagination';
// import CircularProgress from '@mui/material-next/CircularProgress';
// import { getFoodProduct } from '../api/FoodProductsAPI';
// import '../css/recipeStatusPage.css';

// const DataTable = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState({
//     status: [],
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [recipesPerPage] = useState(8);
//   const [openChangeStatusDialog, setOpenChangeStatusDialog] = useState(false);
//   const [selectedRecipe, setSelectedRecipe] = useState(null);
//   const [newStatus, setNewStatus] = useState('');
//   const [productInfo, setProductInfo] = useState(null);
//   const columns = [
//     { field: 'id', headerName: 'ID', width: 70 },
//     { field: 'name', headerName: 'Name', width: 200 },
//     { field: 'nutrition.protein.totalProtein', headerName: 'Total Protein', width: 150, valueGetter: (params) => params.row.nutrition?.protein?.totalProtein || '' },
//     { field: 'nutrition.carbs.totalCarbs', headerName: 'Total Carbs', width: 150, valueGetter: (params) => params.row.nutrition?.carbs?.totalCarbs || '' },
//     { field: 'nutrition.fat.totalFat', headerName: 'Total Fat', width: 150, valueGetter: (params) => params.row.nutrition?.fat?.totalFat || '' },
//   ];
  
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetchRecipes();
//         if (response != null) {
//           setRecipes(response.data);
//         }
//       } catch (error) {
//         console.error('Error fetching recipes:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filter, searchTerm]);

//   const handleFilterChange = (status) => {
//     const statusFilters = filter.status.includes(status)
//       ? filter.status.filter(s => s !== status)
//       : [...filter.status, status];
//     setFilter({ ...filter, status: statusFilters });
//   };

//   const handleSearchChange = event => {
//     setSearchTerm(event.target.value);
//   };

//   const handleOpenChangeStatusDialog = async (recipe) => {
//     setSelectedRecipe(recipe);
//     setNewStatus(recipe.status);
//     setOpenChangeStatusDialog(true);
    
//     try {
//       const productInfoPromises = recipe.foodProducts.map(productId => getFoodProduct(productId));
//       const productInfos = await Promise.all(productInfoPromises);
//       const foodProducts = productInfos.map(response => response.data);
      
//       setProductInfo(foodProducts);
//     } catch (error) {
//       console.error('Error fetching product information:', error);
//     }
//   };

//   const handleCloseChangeStatusDialog = () => {
//     setOpenChangeStatusDialog(false);
//     setProductInfo(null);
//   };

//   const handleChangeStatus = async () => {
//     try {
//       const updatedRecipe = { recipe_id: selectedRecipe.recipe_id, status: newStatus };
//       await updateRecipeStatus(updatedRecipe);
//       setRecipes(prevRecipes => {
//         return prevRecipes.map(recipe => {
//           if (recipe.recipe_id === selectedRecipe.recipe_id) {
//             return { ...recipe, status: newStatus };
//           }
//           return recipe;
//         });
//       });
//       setOpenChangeStatusDialog(false);
//     } catch (error) {
//       console.error('Error updating recipe status:', error);
//     }
//   };

//   const filteredRecipes = recipes.filter(recipe => {
//     if (filter.status.length > 0 && !filter.status.includes(recipe.status)) {
//       return false;
//     }
//     if (searchTerm !== '') {
//       return recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
//     }
//     return true;
//   });

//   const indexOfLastRecipe = currentPage * recipesPerPage;
//   const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
//   const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

//   const paginate = pageNumber => setCurrentPage(pageNumber);

//   const getStatusCount = status => {
//     return filteredRecipes.filter(recipe => recipe.status === status).length;
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="filters-panel">
//         <h2>Filters</h2>
//         <TextField
//           variant="outlined"
//           label="Search"
//           value={searchTerm}
//           onChange={handleSearchChange}
//           className="search-input"
//         />
//         <div>
//           <FormControlLabel
//             control={<Checkbox checked={filter.status.includes('APPROVED')} onChange={() => handleFilterChange('APPROVED')} />}
//             label={`Approved (${getStatusCount('APPROVED')})`}
//           />
//           <FormControlLabel
//             control={<Checkbox checked={filter.status.includes('PENDING')} onChange={() => handleFilterChange('PENDING')} />}
//             label={`Pending (${getStatusCount('PENDING')})`}
//           />
//           <FormControlLabel
//             control={<Checkbox checked={filter.status.includes('UNAPPROVED')} onChange={() => handleFilterChange('UNAPPROVED')} />}
//             label={`Unapproved (${getStatusCount('UNAPPROVED')})`}
//           />
//         </div>
//       </div>
//       <div className="recipes-panel">
//         {loading ? (
//           <div id="loadingAnimation">
//             <CircularProgress color="tertiary" fourColor variant="indeterminate" />
//           </div>
//         ) : (
//           <div id="dataGrid">
//             <h2>Recipes</h2>
//             <Grid container spacing={2}>
//               {currentRecipes.map(recipe => (
//                 <Grid item key={recipe.recipe_id} xs={12} sm={6} md={4} lg={3} xl={3}>
//                   <div className="recipe-card">
//                     <h3>{recipe.title}</h3>

//                     <p>{recipe.description}</p>
//                     {/* <p>Chef: {recipe.chef_id}</p> */}
//                     <p>Cooking Time: {recipe.cookingTime}</p>
//                     <p>Status: {recipe.status}</p>
//                     <Button onClick={() => handleOpenChangeStatusDialog(recipe)}>Change Status</Button>
//                   </div>
//                 </Grid>
//               ))}
//             </Grid>
//             <Pagination
//               count={Math.ceil(filteredRecipes.length / recipesPerPage)}
//               page={currentPage}
//               onChange={(event, page) => setCurrentPage(page)}
//               variant="outlined"
//               shape="rounded"
//               className="pagination-controls"
//             />
//           </div>
//         )}
//       </div>
//       <Dialog open={openChangeStatusDialog} onClose={handleCloseChangeStatusDialog}>
//         {selectedRecipe && (
//           <DialogTitle>{selectedRecipe.title}</DialogTitle>
//         )}
//         <DialogContent>
//           {productInfo && (
//             <div style={{ height: 300, width: '100%' }}>
//               <DataGrid
//                 rows={productInfo}
//                 columns={columns}
//                 pageSize={5}
//                 checkboxSelection={false}
//               />
//             </div>
//           )}
//           <p>Description: {selectedRecipe && selectedRecipe.description}</p>

//           {/* <p>Chef: {selectedRecipe && selectedRecipe.chef_id}</p> */}
//           <p>Cooking Time: {selectedRecipe && selectedRecipe.cookingTime}</p>
//           <p>Status: {selectedRecipe && selectedRecipe.status}</p>
//           <TextField
//             select
//             label="New Status"
//             value={newStatus}
//             onChange={e => setNewStatus(e.target.value)}
//             fullWidth
//           >
//             {['PENDING', 'APPROVED', 'UNAPPROVED'].map(status => (
//               <MenuItem key={status} value={status}>
//                 {status}
//               </MenuItem>
//             ))}
//           </TextField>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseChangeStatusDialog}>Cancel</Button>
//           <Button onClick={handleChangeStatus}>Save</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default DataTable;




import React, { useEffect, useState } from 'react';
import { Grid, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { fetchRecipes, updateRecipeStatus } from '../api/RecipesAPI';
import { DataGrid } from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material-next/CircularProgress';
import { getFoodProduct } from '../api/FoodProductsAPI';
import '../css/recipeStatusPage.css';

const DataTable = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(8);
  const [openChangeStatusDialog, setOpenChangeStatusDialog] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [productInfo, setProductInfo] = useState(null);
  const [notFoundProductIds, setNotFoundProductIds] = useState([]); // New state to hold not found product IDs
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'nutrition.protein.totalProtein', headerName: 'Total Protein', width: 150, valueGetter: (params) => params.row.nutrition?.protein?.totalProtein || '' },
    { field: 'nutrition.carbs.totalCarbs', headerName: 'Total Carbs', width: 150, valueGetter: (params) => params.row.nutrition?.carbs?.totalCarbs || '' },
    { field: 'nutrition.fat.totalFat', headerName: 'Total Fat', width: 150, valueGetter: (params) => params.row.nutrition?.fat?.totalFat || '' },
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchRecipes();
        if (response != null) {
          setRecipes(response.data);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const handleFilterChange = (status) => {
    const statusFilters = filter.status.includes(status)
      ? filter.status.filter(s => s !== status)
      : [...filter.status, status];
    setFilter({ ...filter, status: statusFilters });
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleOpenChangeStatusDialog = async (recipe) => {
    setSelectedRecipe(recipe);
    setNewStatus(recipe.status);
    setOpenChangeStatusDialog(true);
    
    try {
      const productInfoPromises = recipe.foodProducts.map(productId => getFoodProduct(productId));
      const productInfos = await Promise.allSettled(productInfoPromises);
      const foodProducts = [];
      const notFoundIds = [];

      productInfos.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          foodProducts.push(result.value.data);
        } else {
          notFoundIds.push(recipe.foodProducts[index]);
        }
      });
      
      setProductInfo(foodProducts);
      setNotFoundProductIds(notFoundIds); // Set the not found product IDs state
    } catch (error) {
      console.error('Error fetching product information:', error);
    }
  };

  const handleCloseChangeStatusDialog = () => {
    setOpenChangeStatusDialog(false);
    setProductInfo(null);
    setNotFoundProductIds([]); // Reset the not found product IDs state
  };

  const handleChangeStatus = async () => {
    try {
      const updatedRecipe = { recipe_id: selectedRecipe.recipe_id, status: newStatus };
      console.log(updatedRecipe)
       
      console.log(await updateRecipeStatus(updatedRecipe))
      setRecipes(prevRecipes => {
        return prevRecipes.map(recipe => {
          if (recipe.recipe_id === selectedRecipe.recipe_id) {
            return { ...recipe, status: newStatus };
          }
          return recipe;
        });
      });
      setOpenChangeStatusDialog(false);
    } catch (error) {
      console.error('Error updating recipe status:', error);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (filter.status.length > 0 && !filter.status.includes(recipe.status)) {
      return false;
    }
    if (searchTerm !== '') {
      return recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const getStatusCount = status => {
    return filteredRecipes.filter(recipe => recipe.status === status).length;
  };

  return (
    <div className="dashboard-container">
      <div className="filters-panel">
        <h2>Filters</h2>
        <TextField
          variant="outlined"
          label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <div>
          <FormControlLabel
            control={<Checkbox checked={filter.status.includes('APPROVED')} onChange={() => handleFilterChange('APPROVED')} />}
            label={`Approved (${getStatusCount('APPROVED')})`}
          />
          <FormControlLabel
            control={<Checkbox checked={filter.status.includes('PENDING')} onChange={() => handleFilterChange('PENDING')} />}
            label={`Pending (${getStatusCount('PENDING')})`}
          />
          <FormControlLabel
            control={<Checkbox checked={filter.status.includes('UNAPPROVED')} onChange={() => handleFilterChange('UNAPPROVED')} />}
            label={`Unapproved (${getStatusCount('UNAPPROVED')})`}
          />
        </div>
      </div>
      <div className="recipes-panel">
        {loading ? (
          <div id="loadingAnimation">
            <CircularProgress color="tertiary" fourColor variant="indeterminate" />
          </div>
        ) : (
          <div id="dataGrid">
            <h2>Recipes</h2>
            <Grid container spacing={2}>
              {currentRecipes.map(recipe => (
                <Grid item key={recipe.recipe_id} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <div className="recipe-card">
                    <h3>{recipe.title}</h3>

                    <p>{recipe.description}</p>
                    {/* <p>Chef: {recipe.chef_id}</p> */}
                    <p>Cooking Time: {recipe.cookingTime}</p>
                    <p>Status: {recipe.status}</p>
                    <Button onClick={() => handleOpenChangeStatusDialog(recipe)}>Change Status</Button>
                  </div>
                </Grid>
              ))}
            </Grid>
            <Pagination
              count={Math.ceil(filteredRecipes.length / recipesPerPage)}
              page={currentPage}
              onChange={(event, page) => setCurrentPage(page)}
              variant="outlined"
              shape="rounded"
              className="pagination-controls"
            />
          </div>
        )}
      </div>
      <Dialog open={openChangeStatusDialog} onClose={handleCloseChangeStatusDialog}>
        {selectedRecipe && (
          <DialogTitle>{selectedRecipe.title}</DialogTitle>
        )}
        <DialogContent>
          {productInfo && (
            <div style={{ height: 300, width: '100%' }}>
              <DataGrid
                rows={productInfo}
                columns={columns}
                pageSize={5}
                checkboxSelection={false}
              />
            </div>
          )}
          {notFoundProductIds.length > 0 && (
            <div>
              <p>The following food product IDs were not found:</p>
              <ul>
                {notFoundProductIds.map(productId => (
                  <li key={productId}>{productId}</li>
                ))}
              </ul>
            </div>
          )}
          <p>Description: {selectedRecipe && selectedRecipe.description}</p>

          {/* <p>Chef: {selectedRecipe && selectedRecipe.chef_id}</p> */}
          <p>Cooking Time: {selectedRecipe && selectedRecipe.cookingTime}</p>
           {/* Nutrition Label */}
        <div className="nutrition-label">
          <p className="nutrition-label-heading">Nutrition Facts</p>
          <hr />
          <div className="nutrition-label-values">
            <div>
              <p>Amount per Serving</p>
            </div>
            <div>
              <p>Calories {(selectedRecipe && selectedRecipe.caloriesPerServing.fat*9)+(selectedRecipe && selectedRecipe.caloriesPerServing.protein*4)+(selectedRecipe && selectedRecipe.caloriesPerServing.carbs*4)} per 100 grams</p>
            </div>
          </div>
          <hr />
          <div className="nutrition-label-values">
            <div>
              <p>Total Fat {selectedRecipe && selectedRecipe.caloriesPerServing.fat}g</p>
            </div>
            <div>
              <p>% Daily Value*</p>
            </div>
          </div>
          <hr />
          <div className="nutrition-label-values">
            <div>
              <p>Carbohydrates {selectedRecipe && selectedRecipe.caloriesPerServing.carbs}g</p>
            </div>
            <div>
              <p>% Daily Value*</p>
            </div>
          </div>
          <hr />
          <div className="nutrition-label-values">
            <div>
              <p>Protein {selectedRecipe && selectedRecipe.caloriesPerServing.protein}g</p>
            </div>
            <div>
              <p>% Daily Value*</p>
            </div>
          </div>
          <hr />
          <p className="nutrition-label-footer">*Percent Daily Values are based on a 2000 calorie diet.</p>
        </div>
        <br/>
          <p>Status: {selectedRecipe && selectedRecipe.status}</p>
          <TextField
            select
            label="New Status"
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
            fullWidth
          >
            {['PENDING', 'APPROVED', 'UNAPPROVED'].map(status => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChangeStatusDialog}>Cancel</Button>
          <Button onClick={handleChangeStatus}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DataTable;
