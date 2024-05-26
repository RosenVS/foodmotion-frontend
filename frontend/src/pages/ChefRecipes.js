import React, { useEffect, useState } from 'react';
import {
  Grid,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material-next/CircularProgress';
import { fetchChefRecipes, updateRecipe,createRecipe } from '../api/RecipesAPI';

import { fetchFoodProducts, getFoodProduct } from '../api/FoodProductsAPI';
import '../css/recipeStatusPage.css';

const DataTable = () => {
  const [servings, setServings] = useState(1);
  const [recipes, setRecipes] = useState([]);
  const [foodProducts, setFoodProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: [],
    duration: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(8);
  const [openChangeStatusDialog, setOpenChangeStatusDialog] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
  const [notFoundProductIds, setNotFoundProductIds] = useState([]);
  const [selectedFoodProducts, setSelectedFoodProducts] = useState([]);
  const [totalNutrition, setTotalNutrition] = useState({ carbs: 0, fat: 0, protein: 0, calories: 0 });

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
        const recipeResponse = await fetchChefRecipes();
        const foodProductsResponse = await fetchFoodProducts();
        if (recipeResponse != null) {
          setRecipes(recipeResponse.data);
        }
        if (foodProductsResponse != null) {
          setFoodProducts(foodProductsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const handleFilterChange = (type, value) => {
    if (type === 'status') {
      const statusFilters = filter.status.includes(value)
        ? filter.status.filter(s => s !== value)
        : [...filter.status, value];
      setFilter({ ...filter, status: statusFilters });
    } else if (type === 'duration') {
      setFilter({ ...filter, duration: value });
    }
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleOpenChangeStatusDialog = async (recipe) => {
    setSelectedRecipe(recipe);
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

      setSelectedFoodProducts(foodProducts);
      setNotFoundProductIds(notFoundIds);
      calculateTotalNutrition(foodProducts);
    } catch (error) {
      console.error('Error fetching product information:', error);
    }
  };

  const handleCloseChangeStatusDialog = () => {
    setOpenChangeStatusDialog(false);
    setProductInfo(null);
    setNotFoundProductIds([]);
    setOpenCreate(false);
    setSelectedFoodProducts([]);
    setTotalNutrition({ carbs: 0, fat: 0, protein: 0, calories: 0 });
  };

  const handleChangeStatus = async () => {
    try {
      const caloriesPerServing = {
        carbs: (totalNutrition.carbs).toFixed(1),
        fat: (totalNutrition.fat).toFixed(1),
        protein: (totalNutrition.protein).toFixed(1)
      };
      const selectedFoodProductIds = selectedFoodProducts.map(product => product.id);


      const recipetoAdd = {
        chef_id: localStorage.getItem("UserUID"),
        caloriesPerServing: caloriesPerServing,
        description: selectedRecipe.description,
        cookingTime: selectedRecipe.cookingTime,
        title: selectedRecipe.title,
        servings: servings,
        status: "PENDING",
        foodProducts: selectedFoodProductIds
      };
      await updateRecipe(recipetoAdd, selectedRecipe.recipe_id);
      const updatedRecipes = recipes.map(recipe => {
        if (recipe.recipe_id === selectedRecipe.recipe_id) {
          // Replace the existing recipe with the updated one
          return {
            ...recipe,
            title: recipetoAdd.title,
            description: recipetoAdd.description,
            cookingTime: recipetoAdd.cookingTime,
            servings: recipetoAdd.servings,
            status: recipetoAdd.status,
            foodProducts: recipetoAdd.foodProducts
          };
        } else {
          return recipe;
        }
      });
      setRecipes(updatedRecipes);      
      
      console.log(recipetoAdd);
      setOpenChangeStatusDialog(false);
    } catch (error) {
      console.error('Error updating recipe status:', error);
    }
  };

  const calculateTotalNutrition = (selectedFoodProducts) => {
    const totalNutrition = selectedFoodProducts.reduce(
      (acc, product) => {
        acc.carbs += product.nutrition?.carbs?.totalCarbs || 0;
        acc.fat += product.nutrition?.fat?.totalFat || 0;
        acc.protein += product.nutrition?.protein?.totalProtein || 0;
        acc.calories += (product.nutrition?.carbs?.totalCarbs || 0) * 4;
        acc.calories += (product.nutrition?.fat?.totalFat || 0) * 9;
        acc.calories += (product.nutrition?.protein?.totalProtein || 0) * 4;
        return acc;
      },
      { carbs: 0, fat: 0, protein: 0, calories: 0 }
    );
    setTotalNutrition(totalNutrition);
  };

  const handleAddFoodProduct = (product) => {
    if (!selectedFoodProducts.some(item => item.id === product.id)) {
      const newSelectedFoodProducts = [...selectedFoodProducts, product];
      setSelectedFoodProducts(newSelectedFoodProducts);
      calculateTotalNutrition(newSelectedFoodProducts);
    }
  };

  const handleRemoveFoodProduct = (product) => {
    const newSelectedFoodProducts = selectedFoodProducts.filter((item) => item.id !== product.id);
    setSelectedFoodProducts(newSelectedFoodProducts);
    calculateTotalNutrition(newSelectedFoodProducts);
  };

  const handleFieldChange = (field, value) => {
    setSelectedRecipe({ ...selectedRecipe, [field]: value });
  };

  const handleNutritionChange = (type, value) => {
    setSelectedRecipe({
      ...selectedRecipe,
      caloriesPerServing: {
        ...selectedRecipe.caloriesPerServing,
        [type]: value
      }
    });
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (filter.status.length > 0 && !filter.status.includes(recipe.status)) {
      return false;
    }
    if (filter.duration !== '') {
      const [min, max] = filter.duration.split('-').map(Number);
      const duration = recipe.cookingTime;
      return duration >= min && duration <= max;
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



  const handleCreateRecipe = async () => {
    try {
      // Same logic as before for gathering recipe information
      const caloriesPerServing = {
        carbs: (totalNutrition.carbs).toFixed(1),
        fat: (totalNutrition.fat).toFixed(1),
        protein: (totalNutrition.protein).toFixed(1)
      };
      const selectedFoodProductIds = selectedFoodProducts.map(product => product.id);

      const newRecipe = {
        chef_id: localStorage.getItem("UserUID"),
        caloriesPerServing: caloriesPerServing,
        description: selectedRecipe.description,
        cookingTime: selectedRecipe.cookingTime,
        title: selectedRecipe.title,
        servings: servings,
        foodProducts: selectedFoodProductIds
      };

      // Call createRecipe function
      await createRecipe(newRecipe);

      // Update the state with the newly created recipe
      setRecipes([...recipes, newRecipe]); // Assuming the response doesn't contain the ID
      handleCloseChangeStatusDialog(); // Close the dialog after creation
    } catch (error) {
      console.error('Error creating recipe:', error);
    }
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
control={<Checkbox checked={filter.status.includes('APPROVED')} onChange={() => handleFilterChange('status','APPROVED')} />}
label={`Approved (${getStatusCount('APPROVED')})`}
/>
<FormControlLabel
control={<Checkbox checked={filter.status.includes('PENDING')} onChange={() => handleFilterChange('status','PENDING')} />}
label={`Pending (${getStatusCount('PENDING')})`}
/>
<FormControlLabel
control={<Checkbox checked={filter.status.includes('UNAPPROVED')} onChange={() => handleFilterChange('status','UNAPPROVED')} />}
label={`Unapproved (${getStatusCount('UNAPPROVED')})`}
/>
      </div>
      <h3>Cooking time</h3>

      <TextField
        select
        label="Duration"
        value={filter.duration}
        onChange={e => handleFilterChange('duration', e.target.value)}
        className="duration-filter"
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="0-5">Less than 5 minutes</MenuItem>
        <MenuItem value="5-15">Between 5 and 15 minutes</MenuItem>
        <MenuItem value="15-30">Between 15 and 30 minutes</MenuItem>
        <MenuItem value="30-45">Between 30 and 45 minutes</MenuItem>
        <MenuItem value="45+">Above 45 minutes</MenuItem>
      </TextField>
    </div>
    <div className="recipes-panel">
      {loading ? (
        <div id="loadingAnimation">
          <CircularProgress color="tertiary" fourColor variant="indeterminate" />
        </div>
      ) : (
        <div id="dataGrid">
           <Button onClick={() => {
        setSelectedRecipe({
          title: '',
          description: '',
          cookingTime: '',
          foodProducts: [],
          caloriesPerServing: { carbs: 0, fat: 0, protein: 0 }
        }); // Reset selected recipe state for creating a new recipe
        setOpenChangeStatusDialog(true);
        setOpenCreate(true);
        
      }} color="primary" variant="contained">Create</Button>
          <h2>Recipes</h2>
          <Grid container spacing={2}>
            {currentRecipes.map(recipe => (
              <Grid item key={recipe.recipe_id} xs={12} sm={6} md={4} lg={3} xl={3}>
                <div className="recipe-card">
                  <h3>{recipe.title}</h3>

                  <p>{recipe.description}</p>
                  {/* <p>Chef: {recipe.chef_id}</p> */}
                  <p>Cooking Time: {recipe.cookingTime}</p>
                  <Button onClick={() => handleOpenChangeStatusDialog(recipe)}>Update</Button>
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
<DialogTitle>Edit Recipe: {selectedRecipe.title}</DialogTitle>
)}
<DialogContent>
<TextField
label="Title"
value={selectedRecipe?.title || ''}
onChange={(e) => handleFieldChange('title', e.target.value)}
fullWidth
margin="normal"
/>
<TextField
label="Description"
value={selectedRecipe?.description || ''}
onChange={(e) => handleFieldChange('description', e.target.value)}
fullWidth
margin="normal"
/>
<TextField
label="Cooking Time in minutes"
value={selectedRecipe?.cookingTime || ''}
onChange={(e) => handleFieldChange('cookingTime', e.target.value)}
fullWidth
margin="normal"
/>
<Grid container spacing={2}>
<Grid item xs={6}>
<h3>All Food Products</h3>
<div style={{ height: 300, width: '100%' }}>
<DataGrid
rows={foodProducts}
columns={columns}
pageSize={5}
checkboxSelection={false}
onRowClick={(params) => handleAddFoodProduct(params.row)}
/>
</div>
</Grid>
<Grid item xs={6}>
<h3>Selected Food Products</h3>
<div style={{ height: 300, width: '100%' }}>
<DataGrid
rows={selectedFoodProducts}
columns={columns}
pageSize={5}
checkboxSelection={false}
onRowClick={(params) => handleRemoveFoodProduct(params.row)}
/>
</div>
</Grid>
</Grid>

<div className="nutrition-label">
<p className="nutrition-label-heading">Nutrition Facts</p>
<hr />
<div className="nutrition-label-values">
<div>
<p>Amount per {servings} Serving</p>
</div>
<div>
<p>Calories {totalNutrition.calories.toFixed(1)} per serving</p>
</div>
</div>
<hr />
<div className="nutrition-label-values">
<div>
<p>Total Fat in grams</p>
<TextField value={totalNutrition.fat.toFixed(1)} disabled />
</div>
</div>
<hr />
<div className="nutrition-label-values">
<div>
<p>Carbohydrates in grams</p>
<TextField value={totalNutrition.carbs.toFixed(1)} disabled />
</div>
</div>
<hr />
<div className="nutrition-label-values">
<div>
<p>Protein in grams</p>
<TextField value={totalNutrition.protein.toFixed(1)} disabled />
</div>
</div>
</div>
</DialogContent>
<DialogActions>
  <Button onClick={handleCloseChangeStatusDialog}>Cancel</Button>
  {openCreate ? ( // Check if selectedRecipe exists
    // If selectedRecipe exists, render Update button
    <Button onClick={handleCreateRecipe}>Create</Button>

  ) : (
    // If selectedRecipe is null, render Create button
    <Button onClick={handleChangeStatus}>Update</Button>

  )}
</DialogActions>
</Dialog>
</div>
);
};

export default DataTable;