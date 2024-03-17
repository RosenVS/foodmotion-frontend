import logo from './logo.svg'
import {BrowserRouter,Route,Routes} from "react-router-dom"
import AppBar from './components/AppBar'
import Footer from './components/Footer'
import Layout from './components/Layout'
import Missing from './components/Missing'
import Unauthorized from './components/Unauthorized'
import Homepage from './pages/Homepage'
import FoodProducts from './pages/FoodProducts'

import './App.css'

function App () {
  return (
    <div className='App'>
       <AppBar/>
       <Routes>
       <Route path='/' element={<Homepage/>}/>

       <Route path="/unauthorized" element={<Unauthorized />} />
       
       
        <Route path="manager" >
          {/* <Route path="food-products" element={<ProtectedRoutes roleRequired="MANAGER" departmentRequired="Workout" />}> */}

          {/* </Route>      */}
          <Route path='food-products' element={<FoodProducts/>}/>
          
          </Route>  

       <Route path="*" element={<Missing />} />

      <Route path="/" element={<Layout />}></Route>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
