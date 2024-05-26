
import React, { useEffect, useState } from 'react';
import { Grid, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import { fetchApprovedRecipes } from '../api/RecipesAPI';
import { DataGrid } from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material-next/CircularProgress';
import { getFoodProduct } from '../api/FoodProductsAPI';
import { useNavigate } from "react-router-dom";
import { createNewNutritionOfTheDay } from '../api/DailyNutritionAPI';

import '../css/recipeStatusPage.css';

const DataTable = () => {
  const [servings, setServings] = useState(1);
  const history = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: [],
    duration: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(8);
  const [openChangeStatusDialog, setOpenChangeStatusDialog] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newTimeOfTheDayForRecipe, setTimeOfTheDayForRecipe] = useState('');
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
        const response = await fetchApprovedRecipes();
        if (response != null) {
          setRecipes(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.clear();
          history('/login');
        } else {
          console.error('Error fetching recipes:', error);
        }      } finally {
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
    setTimeOfTheDayForRecipe("BREAKFAST");
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
    
  
      const recipetoAdd = {
        userId: localStorage.getItem("UserUID"),
        recipeId: selectedRecipe.recipe_id,
        date: null,
        productId: null,
        eatingTime: newTimeOfTheDayForRecipe,
        totalCalories: Math.round(((selectedRecipe.caloriesPerServing?.carbs * 4) + (selectedRecipe.caloriesPerServing?.protein * 4) + (selectedRecipe.caloriesPerServing?.fat * 9)) * servings),
        totalCarbs: Math.round(selectedRecipe.caloriesPerServing?.carbs * servings),
        totalFat: Math.round(selectedRecipe.caloriesPerServing?.fat * servings),
        totalProtein: Math.round(selectedRecipe.caloriesPerServing?.protein * servings),
        serving: servings // Include servings in the recipe object
    };
    console.log(recipetoAdd);
    const response = await createNewNutritionOfTheDay(recipetoAdd);
    history("/daily-nutrition");
      setOpenChangeStatusDialog(false);
    } catch (error) {
      console.error('Error updating recipe status:', error);
    }
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
            <h2>Recipes</h2>
            <Grid container spacing={2}>
              {currentRecipes.map(recipe => (
                <Grid item key={recipe.recipe_id} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <div className="recipe-card">
                    <h3>{recipe.title}</h3>

                    <p>{recipe.description}</p>
                    {/* <p>Chef: {recipe.chef_id}</p> */}
                    <p>Cooking Time: {recipe.cookingTime}</p>
                    <Button onClick={() => handleOpenChangeStatusDialog(recipe)}>Add to Nutrition</Button>
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
        <TextField
  label="Servings"
  type="number"
  value={servings}
  onChange={e => setServings(e.target.value)}
  fullWidth
/>
<br/>
<br/>
        {/* Nutrition Label */}
        <div className="nutrition-label">
          <p className="nutrition-label-heading">Nutrition Facts</p>
          <hr />
          <div className="nutrition-label-values">
            <div>
              <p>Amount per {servings} Serving</p>
            </div>
            <div>
              <p>Calories {(((selectedRecipe && selectedRecipe.caloriesPerServing.fat*9)+(selectedRecipe && selectedRecipe.caloriesPerServing.protein*4)+(selectedRecipe && selectedRecipe.caloriesPerServing.carbs*4))*servings).toFixed(1)} per 100 grams</p>
            </div>
          </div>
          <hr />
          <div className="nutrition-label-values">
            <div>
              <p>Total Fat {((selectedRecipe && selectedRecipe.caloriesPerServing.fat)*servings).toFixed(1)}g</p>
            </div>
            <div>
              <p>% Daily Value*</p>
            </div>
          </div>
          <hr />
          <div className="nutrition-label-values">
            <div>
              <p>Carbohydrates {((selectedRecipe && selectedRecipe.caloriesPerServing.carbs)*servings).toFixed(1)}g</p>
            </div>
            <div>
              <p>% Daily Value*</p>
            </div>
          </div>
          <hr />
          <div className="nutrition-label-values">
            <div>
              <p>Protein {((selectedRecipe && selectedRecipe.caloriesPerServing.protein)*servings).toFixed(1)}g</p>
            </div>
            <div>
              <p>% Daily Value*</p>
            </div>
          </div>
          <hr />
          <p className="nutrition-label-footer">*Percent Daily Values are based on a 2000 calorie diet.</p>
        </div>
        <br/>
       

        <TextField
          select
          label="Add to"
          value={newTimeOfTheDayForRecipe}
          onChange={e => setTimeOfTheDayForRecipe(e.target.value)}
          fullWidth
        >
          {['BREAKFAST', 'LUNCH', 'DINNER'].map(status => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseChangeStatusDialog}>Cancel</Button>
        <Button onClick={handleChangeStatus}>Add</Button>
      </DialogActions>
    </Dialog>
    </div>
  );
};

export default DataTable;
