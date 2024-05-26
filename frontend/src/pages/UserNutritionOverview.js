
import React, { useState, useEffect } from 'react';
import { Box,Typography, Button, Paper, LinearProgress ,TextField, MenuItem ,Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { fetchAccountData } from "../api/FirebaseAPI";
import { getNutrition ,removeFromNutrition} from "../api/DailyNutritionAPI";
import { fetchRecipe } from "../api/RecipesAPI";
import {  getFoodProduct } from '../api/FoodProductsAPI';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MainPage = () => {
  const [servings, setServings] = useState(1);
  const [formData, setFormData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [userCalorieSuggestion, setUserCalorieSuggestion] = useState(null);

  const [nutritionId, setNutritionId] = useState(null);

  // Loading recipe details
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [openChangeeRecipeDetailsDialog, setOpenChangeRecipeDetailsDialog] = useState(false);
  const [productInfo, setProductInfo] = useState(null);
  const [notFoundProductIds, setNotFoundProductIds] = useState([]); // New state to hold not found product IDs
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'nutrition.protein.totalProtein', headerName: 'Total Protein', width: 150, valueGetter: (params) => params.row.nutrition?.protein?.totalProtein || '' },
    { field: 'nutrition.carbs.totalCarbs', headerName: 'Total Carbs', width: 150, valueGetter: (params) => params.row.nutrition?.carbs?.totalCarbs || '' },
    { field: 'nutrition.fat.totalFat', headerName: 'Total Fat', width: 150, valueGetter: (params) => params.row.nutrition?.fat?.totalFat || '' },
  ];


  // Food product info individually
  const [selectedFoodProduct, setSelectedFoodProduct] = useState(null);
  const [openChangeFoodProductDialog, setOpenFoodProductDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNutritionData();
        setFormData(response);
        const response_user = await fetchAccountData();
        setUserCalorieSuggestion(response_user.data); 
      } catch (error) {
        console.error('Error fetching nutrition data:', error);
      }
    };

    fetchData();
  }, [date]); // Fetch data whenever the date changes

  const getNutritionData = async () => {
    const dataToSend = {
      userId: "0b6lwl6FcBPDZrwfBrvIMcR2Gfm1",
      date: date.toISOString().split('T')[0]
    };
    console.log(dataToSend)
    try {
      const response = await getNutrition(dataToSend);
      return response.data;
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      return [];
    }
  };

  const handlePreviousDay = () => {
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() - 1);
    setDate(previousDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    setDate(nextDate);
  };

  const handleRemoveItem = async () => {
    console.log("Remove item with ID:", nutritionId);
  
    try {
      await removeFromNutrition(nutritionId);
  
      setFormData(prevProducts => prevProducts.filter(nutrition => nutrition.id !== nutritionId));
    } catch (error) {
      console.error('Error deleting food product:', error);
    } finally {
      handleCloseDialog();
    }
  };
  

  // Group nutrition data by eating time
  const groupedData = formData.reduce((acc, item) => {
    if (!acc[item.eatingTime]) {
      acc[item.eatingTime] = [];
    }
    acc[item.eatingTime].push(item);
    return acc;
  }, {});

  // Calculate totals for the day
  const totalCalories = formData.reduce((acc, item) => acc + item.totalCalories, 0);
  const totalFat = formData.reduce((acc, item) => acc + item.totalFat, 0);
  const totalCarbs = formData.reduce((acc, item) => acc + item.totalCarbs, 0);
  const totalProtein = formData.reduce((acc, item) => acc + item.totalProtein, 0);

  // Calculate ratios
  const fatPercentage = ((totalFat*9) / totalCalories) * 100;
  const carbPercentage = ((totalCarbs*4) / totalCalories) * 100;
  const proteinPercentage = ((totalProtein*4) / totalCalories) * 100;

  // Data for pie chart
  const pieChartData = [
    { name: 'Fat', value: fatPercentage },
    { name: 'Carbs', value: carbPercentage },
    { name: 'Protein', value: proteinPercentage }
  ];

  // Data for bar chart
  const barChartData = [
    { name: 'Fat', percentage: fatPercentage },
    { name: 'Carbs', percentage: carbPercentage },
    { name: 'Protein', percentage: proteinPercentage }
  ];

  // Calculate percentage of calories consumed compared to the suggested intake
  const caloriesConsumedPercentage = (totalCalories / userCalorieSuggestion?.calorieIntake) * 100 || 0;

  const handleOpenRecipeDetails = async (recipeId) => {
    console.log("Recipe: "+recipeId)
    try {
      const response = await fetchRecipe(recipeId.recipeId);
      console.log(response.data)
      setServings(recipeId.serving)
      setNutritionId(recipeId.id)
      setSelectedRecipe(response.data);
      setOpenChangeRecipeDetailsDialog(true);
      try {
        const productInfoPromises = response.data.foodProducts.map(productId => getFoodProduct(productId));
        const productInfos = await Promise.allSettled(productInfoPromises);
        const foodProducts = [];
        const notFoundIds = [];
  
        productInfos.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            foodProducts.push(result.value.data);
          } else {
            notFoundIds.push(response.data.foodProducts[index]);
          }
        });
        
        setProductInfo(foodProducts);
        setNotFoundProductIds(notFoundIds); // Set the not found product IDs state
      } catch (error) {
        console.error('Error fetching product information:', error);
      }
    } catch (error) {
      console.error('Error fetching recipe data:', error);
    }

  };

  const handleOpenProductDetails = async (productId) => {
    console.log("Product: "+productId.productId)
    
    try {
      const response = await getFoodProduct(productId.productId);
      console.log(response.data)
      setNutritionId(productId.id)

      setServings(productId.serving)

      setSelectedFoodProduct(response.data)
      setOpenFoodProductDialog(true)

    } catch (error) {
      console.error('Error fetching recipe data:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenChangeRecipeDetailsDialog(false);
    setProductInfo(null);
    setNotFoundProductIds([]); // Reset the not found product IDs state
    setSelectedFoodProduct(null)
    setOpenFoodProductDialog(false)
    setNutritionId(null)

  };
  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <br/>
     <Box display="flex" justifyContent="space-evenly" alignItems="center">
      <Button onClick={handlePreviousDay}>Previous Day</Button>
      <Typography variant="h5" gutterBottom>Daily Nutrition</Typography>
      <Button onClick={handleNextDay}>Next Day</Button>
    </Box>
      <Typography>Date: {date.toDateString()}</Typography>
      <Typography>Todays Calorie Intake: {userCalorieSuggestion?.calorieIntake}</Typography>

  
      {/* Display progress bar for calories consumed */}
      <Typography variant="h6" style={{ marginTop: '20px' }}>Calories Consumed Progress</Typography>
      <LinearProgress variant="determinate" value={caloriesConsumedPercentage} />
      <Typography>{Math.round(caloriesConsumedPercentage)}% of daily calories consumed</Typography>
      <Typography>{(userCalorieSuggestion?.calorieIntake -totalCalories).toFixed(1) } kcal Calories left</Typography>

      {/* Display nutrient ratio graphs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <PieChart width={400} height={250}>
          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name }) => name}
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index % 3]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        <BarChart width={400} height={250} data={barChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="percentage" fill="#8884d8" />
        </BarChart>
      </div>
      <Typography>Total Calories Consumed: {totalCalories}</Typography>

      <Typography>Protein: {totalProtein} Carbs: {totalCarbs} Fat: {totalFat}</Typography>


      {/* Display grouped nutrition data */}
      {Object.entries(groupedData).map(([eatingTime, items]) => (
        <div key={eatingTime} style={{ marginBottom: '20px' }}>
          <hr/>

          <Typography variant="h6">{eatingTime}</Typography>
          <Paper elevation={3} style={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd'}}>Name</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Total Calories</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Total Carbs</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Total Fat</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Total Protein</th>
                  <th></th>
                </tr>
              </thead>
              
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.productId ? `Product ID ${item.productId}` : `Recipe ID ${item.recipeId}`}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.totalCalories}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.totalCarbs}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.totalFat}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.totalProtein}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    <Button variant="outlined" onClick={item.productId ? () => handleOpenProductDetails(item) : () => handleOpenRecipeDetails(item)}>Details</Button>
                      </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        </div>
      ))}

      {/* Buttons to navigate to previous and next day */}

      <Dialog open={openChangeeRecipeDetailsDialog} onClose={handleCloseDialog}>
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
  disabled
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
       

      
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleRemoveItem}>Remove</Button>
      </DialogActions>
    </Dialog>



    <Dialog open={openChangeFoodProductDialog} onClose={handleCloseDialog}>
      {selectedFoodProduct && (
        <DialogTitle>{selectedFoodProduct.title}</DialogTitle>
      )}
      <DialogContent>
       
        <p>Description: {selectedFoodProduct && selectedFoodProduct.name}</p>

        {/* <p>Chef: {selectedRecipe && selectedRecipe.chef_id}</p> */}
        <p>Cooking Time: {selectedFoodProduct && selectedFoodProduct.name}</p>
        <TextField
  label="Servings"
  type="number"
  value={servings}
  onChange={e => setServings(e.target.value)}
  fullWidth
  disabled
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
              <p>Calories {(((selectedFoodProduct && selectedFoodProduct.nutrition?.fat?.totalFat*9)+(selectedFoodProduct && selectedFoodProduct.nutrition?.protein?.totalProtein*4)+(selectedFoodProduct && selectedFoodProduct.nutrition?.carbs?.totalCarbs*4))*servings).toFixed(1)} per 100 grams</p>
            </div>
          </div>
          <hr />
          <div className="nutrition-label-values">
            <div>
              <p>Total Fat {((selectedFoodProduct && selectedFoodProduct.nutrition?.fat?.totalFat)*servings).toFixed(1)}g</p>
            </div>
            <div>
              <p>% Daily Value*</p>
            </div>
          </div>
          <hr />
          <div className="nutrition-label-values">
            <div>
              <p>Carbohydrates {((selectedFoodProduct && selectedFoodProduct.nutrition?.carbs?.totalCarbs)*servings).toFixed(1)}g</p>
            </div>
            <div>
              <p>% Daily Value*</p>
            </div>
          </div>
          <hr />
          <div className="nutrition-label-values">
            <div>
              <p>Protein {((selectedFoodProduct && selectedFoodProduct.nutrition?.protein?.totalProtein)*servings).toFixed(1)}g</p>
            </div>
            <div>
              <p>% Daily Value*</p>
            </div>
          </div>
          <hr />
          <p className="nutrition-label-footer">*Percent Daily Values are based on a 2000 calorie diet.</p>
        </div>
        <br/>
       

       
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleRemoveItem}>Remove</Button>
      </DialogActions>
    </Dialog>
    </div>
  );
};

export default MainPage;

