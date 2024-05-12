import React, { useEffect, useState } from 'react';
import { Grid, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, Button,TextField } from '@mui/material';
import { fetchFoodProducts } from '../api/FoodProductsAPI';
import Pagination from '@mui/material/Pagination';

import CircularProgress from '@mui/material-next/CircularProgress';

import '../css/foodProductsdaily.css';

const DataTable = () => {
  const [foodProducts, setFoodProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [filter, searchTerm]);

  const handleFilterChange = restriction => {
    setFilter({ ...filter, [restriction]: !filter[restriction] });
  };

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
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
              label={`${key} (${getRestrictionCount(key)})`} // Add count to label
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
    </div>
  );
};

export default DataTable;