import React, { useEffect, useState } from 'react';
import { Grid, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, Button,TextField, MenuItem } from '@mui/material';
import { fetchFoodProducts } from '../api/FoodProductsAPI';
import { createNewNutritionOfTheDay } from '../api/DailyNutritionAPI';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from "react-router-dom";

import CircularProgress from '@mui/material-next/CircularProgress';

import '../css/foodProductsdaily.css';

const DataTable = () => {
  const [foodProducts, setFoodProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newTimeOfTheDayForRecipe, setTimeOfTheDayForRecipe] = useState('');
  const [openChangeStatusDialog, setOpenChangeStatusDialog] = useState(false);
  const [servings, setServings] = useState(1);
  const history = useNavigate();

  const [filter, setFilter] = useState({
    glutenFree: false,
    lactoseFree: false,
    vegan: false,
    vegetarian: false,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8); // Change the number of products per page here

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFoodProducts();
        if (response != null) {
          const data = response.data.map(product => ({
            ...product,
            id: product.id,
            name: product.name,
            nutrition: product.nutrition,
          }));
          setFoodProducts(data);
        }
      } catch (error) {
        console.error('Error fetching food products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const handleOpenChangeStatusDialog = async (recipe) => {
    setSelectedRecipe(recipe);
    setTimeOfTheDayForRecipe("BREAKFAST");
    setOpenChangeStatusDialog(true);
    
   
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [filter, searchTerm]);

  const handleFilterChange = restriction => {
    setFilter({ ...filter, [restriction]: !filter[restriction] });
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };
  const handleCloseChangeStatusDialog = () => {
    setOpenChangeStatusDialog(false);
  };
  

  const handleChangeStatus = async () => {
    try {
      const caloriesPerServing = {
        carbs: (selectedRecipe.nutrition?.carbs?.totalCarbs * servings).toFixed(1),
        fat: (selectedRecipe.nutrition?.fat?.totalFat * servings).toFixed(1),
        protein: (selectedRecipe.nutrition?.fat?.totalProtein * servings).toFixed(1)
      };
  
      const recipetoAdd = {
        userId: localStorage.getItem("UserUID"),
        recipeId: null,
        date: null,
        productId: selectedRecipe.id,
        eatingTime: newTimeOfTheDayForRecipe,
        totalCalories: Math.round(((selectedRecipe.nutrition?.carbs?.totalCarbs * 4) + (selectedRecipe.nutrition?.protein?.totalProtein * 4) + (selectedRecipe.nutrition?.fat?.totalFat * 9)) * servings),
        totalCarbs: Math.round(selectedRecipe.nutrition?.carbs?.totalCarbs * servings),
        totalFat: Math.round(selectedRecipe.nutrition?.fat?.totalFat * servings),
        totalProtein: Math.round(selectedRecipe.nutrition?.protein?.totalProtein * servings),
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

  const filteredProducts = foodProducts.filter(product => {
    for (let key in filter) {
      if (filter[key] && !product.dietaryRestrictions[key]) {
        return false;
      }
    }
    if (searchTerm !== '') {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const getRestrictionCount = restriction => {
    return filteredProducts.filter(
      product => product.dietaryRestrictions[restriction]
    ).length;
  };

  return (
    <div className="container">
      <div className="left-panel">
        <h2>Filters</h2>
        <TextField
          variant="outlined"
          label="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
          sx={{ l: 1}} 
        />
        <div>
          {Object.entries(filter).map(([key, value]) => (
            <FormControlLabel
              key={key}
              control={<Checkbox checked={value} onChange={() => handleFilterChange(key)} />}
              label={`${key} (${getRestrictionCount(key)})`} 
            />
          ))}
        </div>
      </div>
      <div className="right-panel">
        {loading ? (
          <div id='loadingAnimation'>
            <CircularProgress color="tertiary" fourColor variant="indeterminate" />
          </div>
        ) : (
          <div id='dataGrid'>
                <h2>Food-Products</h2>
            <Grid container spacing={2}>
              {currentProducts.map(product => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3} xl={3}>
                  <div className="product-card">
                    <h3>{product.name}</h3>
                    <p>Total Protein: {product.nutrition?.protein?.totalProtein}</p>
                    <div className="nutrition-info">
                      <p>Total Carbs: {product.nutrition?.carbs?.totalCarbs}</p>
                    </div>
                    <div className="fat-info">
                      <p>Total Fat: {product.nutrition?.fat?.totalFat}</p>
                    </div>
                    <Button onClick={() => handleOpenChangeStatusDialog(product)}>Add to Nutrition</Button>

                  </div>
                </Grid>
              ))}
            </Grid>
            <Pagination
  count={Math.ceil(filteredProducts.length / productsPerPage)}
  page={currentPage}
  onChange={(event, page) => setCurrentPage(page)} // Update currentPage state
  variant="outlined"
  shape="rounded"
  className="pagination"
/>
          </div>
        )}
      </div>
      <Dialog open={openChangeStatusDialog} onClose={handleCloseChangeStatusDialog}>
      {selectedRecipe && (
        <DialogTitle>{selectedRecipe.title}</DialogTitle>
      )}
      <DialogContent>
       
        <p>Description: {selectedRecipe && selectedRecipe.name}</p>

        {/* <p>Chef: {selectedRecipe && selectedRecipe.chef_id}</p> */}
        <p>Cooking Time: {selectedRecipe && selectedRecipe.name}</p>
        <TextField
  label="Servings"
  type="number"
  value={servings}
  onChange={e => setServings(e.target.value)}
  fullWidth
/>
        {/* Nutrition Label */}
        <div className="nutrition-label">
          <p className="nutrition-label-heading">Nutrition Facts</p>
          <hr />
          <div className="nutrition-label-values">
            <div>
              <p>Amount per {servings} Serving</p>
            </div>
            <div>
              <p>Calories {(((selectedRecipe && selectedRecipe.nutrition?.fat?.totalFat*9)+(selectedRecipe && selectedRecipe.nutrition?.protein?.totalProtein*4)+(selectedRecipe && selectedRecipe.nutrition?.carbs?.totalCarbs*4))*servings).toFixed(1)} per 100 grams</p>
            </div>
          </div>
          <hr />
          <div className="nutrition-label-values">
            <div>
              <p>Total Fat {((selectedRecipe && selectedRecipe.nutrition?.fat?.totalFat)*servings).toFixed(1)}g</p>
            </div>
            <div>
              <p>% Daily Value*</p>
            </div>
          </div>
          <hr />
          <div className="nutrition-label-values">
            <div>
              <p>Carbohydrates {((selectedRecipe && selectedRecipe.nutrition?.carbs?.totalCarbs)*servings).toFixed(1)}g</p>
            </div>
            <div>
              <p>% Daily Value*</p>
            </div>
          </div>
          <hr />
          <div className="nutrition-label-values">
            <div>
              <p>Protein {((selectedRecipe && selectedRecipe.nutrition?.protein?.totalProtein)*servings).toFixed(1)}g</p>
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



