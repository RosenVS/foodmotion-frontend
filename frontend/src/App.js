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
import RegisterAndLogin from './pages/RegisterAndLogin'
import Profile from './pages/Profile'
import UserProfile from './pages/UserProfile'

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
       
        <Route path="manager" >
        
          <Route path='food-products' element={<FoodProducts/>}/>
          
          </Route>  
            
        <Route path="daily-nutrition" >
        
        <Route path='food-products' element={<FoodProducts2/>}/>
        
        </Route>  

       <Route path="*" element={<Missing />} />

      <Route path="/" element={<Layout />}></Route>
      </Routes>
      <Footer />
    </div>
  )
}

export default App





