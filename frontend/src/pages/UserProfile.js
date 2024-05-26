import React, { useState , useEffect} from 'react';
import { Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel, TextField, Typography } from '@mui/material';
import { fetchAccountData,updatePersonalDetails,updateDietGoal,updateUserRestrictions,deleteAccount } from "../api/FirebaseAPI";
import { useNavigate } from "react-router-dom";

const activityLevels = [
  { value: 'SEDENTARY', label: 'Little to no exercise' },
  { value: 'LIGHTLY_ACTIVE', label: 'Light exercise/sports 1-3 days a week' },
  { value: 'MODERATELY_ACTIVE', label: 'Moderate exercise/sports 3-5 days a week' },
  { value: 'VERY_ACTIVE', label: 'Hard exercise/sports 6-7 days a week' },
  { value: 'EXTRA_ACTIVE', label: 'Very hard exercise/sports & physical job or 2x training' },
];
const dietLevels = [
  { value: 'LOSE_WEIGHT', label: 'Become more healthier / Lose Weight' },
  { value: 'MAINTAIN_WEIGHT', label: 'Stay healthy / Maintain Weight' },
  { value: 'GAIN_WEIGHT', label: 'Become more healthier / Gain Weight' },

];



const MainPage = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [activeButton, setActiveButton] = useState('');
  const history = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAccountData();
        setFormData(response.data); 
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching account data:', error);
      }
    };

    fetchData();

    // Cleanup function (if needed)
    return () => {
      // Cleanup code here (if needed)
    };
  }, []);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async() => {
    try {
      const userUID = localStorage.getItem("UserUID");
  
      const dataToSend = {
        userUID: userUID,
        personalData: formData.personalData,
        userWeightHeight: formData.userWeightHeight,
        activityLevel: formData.activityLevel
      };
      console.log(dataToSend);

      await updatePersonalDetails(dataToSend);
      
      
    } catch (error) {
      console.error('Error updating user personal details:', error);
    } finally {
      setOpen(false);
    }

   
  };


  const handleDietGoalSave = async() => {
    try {
      const userUID = localStorage.getItem("UserUID");
  
      const dataToSend = {
        userUID: userUID,
        dietGoal: formData.dietGoal,
      };
      console.log(dataToSend);

      await updateDietGoal(dataToSend);
      await new Promise(resolve => setTimeout(resolve, 500));

      
    } catch (error) {
      console.error('Error updating diet goal :', error);
    } finally {
      const response = await fetchAccountData();
      setFormData(response.data); 
      setOpen(false);
    }
  };

  const handleDietRestrictionsSave = async() => {
    try {
      const userUID = localStorage.getItem("UserUID");
  
      const dataToSend = {
        userUID: userUID,
        userSpecifications: formData.userSpecifications,
      };
      console.log(dataToSend);

      await updateUserRestrictions(dataToSend);
      
      
    } catch (error) {
      console.error('Error updating diet goal :', error);
    } finally {
      setOpen(false);
    }
  };


  const handleDeleteAccount = async() => {
    try {
      const userUID = localStorage.getItem("UserUID");
  
      const dataToSend = {
        userUID: userUID,
      };
      console.log(dataToSend);

      await deleteAccount(dataToSend);
      localStorage.clear();
      history("/");

      
    } catch (error) {
      console.error('Error updating diet goal :', error);
    } finally {
      setOpen(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    const fieldNames = name.split('.');

    const updateNestedFields = (obj, fields, val) => {
      const [currentField, ...remainingFields] = fields;

      if (remainingFields.length === 0) {
        return {
          ...obj,
          [currentField]: val
        };
      }

      return {
        ...obj,
        [currentField]: updateNestedFields(obj[currentField], remainingFields, val)
      };
    };

    setFormData(prevData => updateNestedFields(prevData, fieldNames, value));
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  return (
<div>
<Typography variant="h5" gutterBottom>Profile Settings</Typography>

    <Grid container spacing={3}>

      <Grid item xs={3}>
        <Button onClick={() => handleButtonClick('Personal Details')}>Personal Details</Button>
        <Button onClick={() => handleButtonClick('Diet Restrictions')}>Diet Restrictions</Button>
        <Button onClick={() => handleButtonClick('Diet Goal')}>Diet Goal</Button>
        <Button onClick={() => handleButtonClick('Delete Profile')}>Delete Profile</Button>
      </Grid>
      <Grid item xs={9}>
        {activeButton === 'Personal Details' && (
          <div>
            <Typography variant="h6">Personal Details</Typography>
            <Typography>Age: {formData.personalData.age}</Typography>
            <Typography>Gender: {formData.personalData.gender}</Typography>
            <Typography>Weight: {formData.userWeightHeight.weight} {formData.userWeightHeight.weightMeasurement}</Typography>
            <Typography>Height: {formData.userWeightHeight.height} {formData.userWeightHeight.heightMeasurement}</Typography>
            <Typography>Activity Level: {formData.activityLevel}</Typography>
            <Button onClick={handleClickOpen}>Edit</Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Edit Personal Details</DialogTitle>
              <DialogContent>
            <br/>
                <FormControl fullWidth>
                  <InputLabel>Activity Level</InputLabel>
                  <Select
                    value={formData.activityLevel}
                    onChange={handleChange}
                    name="activityLevel"
                  >
                    {activityLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

            <br/>
            <br/>

                <TextField
                  fullWidth
                  label="Age"
                  name="personalData.age"
                  value={formData.personalData.age}
                  onChange={handleChange}
                />
                 <br/>
            <br/>
                <TextField
                  fullWidth
                  label="Gender"
                  name="personalData.gender"
                  value={formData.personalData.gender}
                  onChange={handleChange}
                />
                 <br/>
            <br/>
                <TextField
                  fullWidth
                  label="Weight"
                  name="userWeightHeight.weight"
                  value={formData.userWeightHeight.weight}
                  onChange={handleChange}
                />
                 <br/>
            <br/>
                <FormControl fullWidth>
                  <InputLabel>Weight Measurement</InputLabel>
                  <Select
                    value={formData.userWeightHeight.weightMeasurement}
                    onChange={handleChange}
                    name="userWeightHeight.weightMeasurement"
                  >
                    <MenuItem value="KG">KG</MenuItem>
                    <MenuItem value="LBS">LBS</MenuItem>
                  </Select>
                </FormControl>
                <br/>
            <br/>
                <TextField
                  fullWidth
                  label="Height"
                  name="userWeightHeight.height"
                  value={formData.userWeightHeight.height}
                  onChange={handleChange}
                />
                 <br/>
            <br/>
                <FormControl fullWidth>
                  <InputLabel>Height Measurement</InputLabel>
                  <Select
                    value={formData.userWeightHeight.heightMeasurement}
                    onChange={handleChange}
                    name="userWeightHeight.heightMeasurement"
                  >
                    <MenuItem value="CM">CM</MenuItem>
                    <MenuItem value="FT">FT</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </DialogActions>
            </Dialog>
          </div>
        )}

{activeButton === 'Diet Restrictions' && (
          <div>
            <Typography variant="h6">Diet Restrictions</Typography>
            <Typography>Gluten Free: {formData.userSpecifications.glutenFree ? 'Yes' : 'No'}</Typography>
            <Typography>Lactose Free: {formData.userSpecifications.lactoseFree ? 'Yes' : 'No'}</Typography>
            <Typography>Vegan: {formData.userSpecifications.vegan ? 'Yes' : 'No'}</Typography>
            <Typography>Vegetarian: {formData.userSpecifications.vegetarian ? 'Yes' : 'No'}</Typography>


            <Button onClick={handleClickOpen}>Edit</Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Edit Diet Restrictions</DialogTitle>
              <DialogContent>
              <br/>
             
                <FormControl fullWidth>
                  <InputLabel>Gluten free</InputLabel>
                  <Select
                    value={formData.userSpecifications.glutenFree}
                    onChange={handleChange}
                    name="userSpecifications.glutenFree"
                  >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </Select>
                </FormControl>
              <br/>
              <br/>
                <FormControl fullWidth>
                  <InputLabel>Lactose free</InputLabel>
                  <Select
                    value={formData.userSpecifications.lactoseFree}
                    onChange={handleChange}
                    name="userSpecifications.lactoseFree"
                  >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </Select>
                </FormControl>
                <br/>
              <br/>
                <FormControl fullWidth>
                  <InputLabel>Vegan</InputLabel>
                  <Select
                    value={formData.userSpecifications.vegan}
                    onChange={handleChange}
                    name="userSpecifications.vegan"
                  >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </Select>
                </FormControl>
                <br/>
              <br/>
                <FormControl fullWidth>
                  <InputLabel>Vegetarian</InputLabel>
                  <Select
                    value={formData.userSpecifications.vegetarian}
                    onChange={handleChange}
                    name="userSpecifications.vegetarian"
                  >
                    <MenuItem value="true">True</MenuItem>
                    <MenuItem value="false">False</MenuItem>
                  </Select>
                </FormControl>
              
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDietRestrictionsSave}>Save</Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
        {activeButton === 'Diet Goal' && (
          <div>
            <Typography variant="h6">Diet Restrictions</Typography>
            <Typography>Diet Goal : {formData.dietGoal}</Typography>
            <br/>
            <Typography>Suggested Calorie Intake: {formData.calorieIntake} </Typography>
            <Typography>With active level of {formData.activityLevel}</Typography>

            <Button onClick={handleClickOpen}>Edit</Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Diet Goal Settings</DialogTitle>
              <DialogContent>
              <br/>
              <FormControl fullWidth>
                  <InputLabel>Diet Goal</InputLabel>
                  <Select
                    value={formData.dietGoal}
                    onChange={handleChange}
                    name="dietGoal"
                  >
                    {dietLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDietGoalSave}>Save</Button>
              </DialogActions>
            </Dialog>
          </div>
        )}

{activeButton === 'Delete Profile' && (
          <div>
            <Typography variant="h6">Delete Profile</Typography>
            <Typography>When deleting an account from FoodMotion, we ensure that all data related to you will be permanently deleted from the whole system!</Typography>


            <Button onClick={handleClickOpen}>Delete</Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogContent>
              <br/>
              <Typography>When deleting an account from FoodMotion, we ensure that all data related to you will be permanently deleted from the whole system!</Typography>

              
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDeleteAccount}>Delete</Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </Grid>
    </Grid>
</div>

  );
};

export default MainPage;
