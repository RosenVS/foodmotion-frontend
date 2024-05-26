// // import logo from './logo.svg'
// // import {BrowserRouter,Route,Routes} from "react-router-dom"
// // import AppBar from './components/AppBar'
// // import Footer from './components/Footer'
// // import Layout from './components/Layout'
// // import Missing from './components/Missing'
// // import Unauthorized from './components/Unauthorized'
// // import Homepage from './pages/Homepage'
// // import FoodProducts from './pages/FoodProducts'
// // import FoodProducts2 from './pages/FoodProductsDaily'
// // import UserRecipes from './pages/RecipesDaily'
// // import RecipesFoodPManager from './pages/RecipesFoodPManager'
// // import RegisterAndLogin from './pages/RegisterAndLogin'
// // import Profile from './pages/Profile'
// // import UserProfile from './pages/UserProfile'

// // import './App.css'

// // function App () {
// //   return (
// //     <div className='App'>
// //        <AppBar/>
// //        <Routes>
// //        <Route path='/' element={<Homepage/>}/>

// //        <Route path="/unauthorized" element={<Unauthorized />} />
       
// //        <Route path='/login' element={<RegisterAndLogin/>}/>
// //        <Route path='/profile' element={<Profile/>}/>
// //        <Route path='/account' element={<UserProfile/>}/>
       
// //         <Route path="manager" >
        
// //           <Route path='food-products' element={<FoodProducts/>}/>
// //           <Route path='recipes' element={<RecipesFoodPManager/>}/>
          
// //           </Route>  
        
// //           <Route path="chef" >
        
// //         <Route path='recipes' element={<RecipesFoodPManager/>}/>
        
// //         </Route> 
            
// //         <Route path="daily-nutrition" >
        
// //         <Route path='food-products' element={<FoodProducts2/>}/>
// //         <Route path='recipes' element={<UserRecipes/>}/>
        
// //         </Route>  

// //        <Route path="*" element={<Missing />} />

// //       <Route path="/" element={<Layout />}></Route>
// //       </Routes>
// //       <Footer />
// //     </div>
// //   )
// // }

// // export default App





import logo from './logo.svg'
import {BrowserRouter,Route,Routes} from "react-router-dom"
import AppBar from './components/AppBar'
import Footer from './components/Footer'
import Layout from './components/Layout'
import Missing from './components/Missing'
import Unauthorized from './components/Unauthorized'
import Homepage from './pages/Homepage'
import FoodProducts from './pages/FoodProducts'
import FoodProducts2 from './pages/FoodProductsDaily'
import UserNutritionOverview from './pages/UserNutritionOverview'
import UserRecipes from './pages/RecipesDaily'
import RecipesFoodPManager from './pages/RecipesFoodPManager'
import ChefRecipes from './pages/ChefRecipes'
import RegisterAndLogin from './pages/RegisterAndLogin'
import Profile from './pages/Profile'
import UserProfile from './pages/UserProfile'
import ProtectedRoutes from './config/ProtectedRoutes'

import './App.css'

function App () {
  return (
    <div className='App'>
       <AppBar/>
       <Routes>
       <Route path='/' element={<Homepage/>}/>

       <Route path="/unauthorized" element={<Unauthorized />} />
       
       <Route path='/login' element={<RegisterAndLogin/>}/>
       <Route path='/profile' element={<Profile/>}/>
       <Route path='/account' element={<UserProfile/>}/>
       
       <Route path="manager" element={<ProtectedRoutes roleRequired="MANAGER" subroleRequired="FOOD_PRODUCT"/>}>
      <Route path='food-products' element={<FoodProducts/>}/>
      <Route path='recipes' element={<RecipesFoodPManager/>}/>
    </Route>
        
          <Route path="chef" element={<ProtectedRoutes roleRequired="CHEF"/>}>
        
        <Route path='recipes' element={<ChefRecipes/>}/>
        
        </Route> 
            
        <Route path="daily-nutrition" element={<ProtectedRoutes roleRequired="USER" />}>
        
        <Route path='food-products' element={<FoodProducts2/>}/>
        <Route path='recipes' element={<UserRecipes/>}/>
        <Route path='' element={<UserNutritionOverview/>}/>
        
        
        </Route>  

       <Route path="*" element={<Missing />} />

      <Route path="/" element={<Layout />}></Route>
      </Routes>
      <Footer />
    </div>
  )
}

export default App


