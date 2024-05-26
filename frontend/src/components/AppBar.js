import React,{useState,useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LoginIcon from '@mui/icons-material/Login';
import '../css/appBar.css';
import companyLogo from '../images/Logo.png'; 

const ResponsiveAppBar = () => {
  const [data, setData] = useState({
    decodedToken: {},
    roles: [],
    subroles: []
  });
const [pages, setPages] = useState([{ name: 'Food Products', href: 'daily-nutrition/food-products', id: "foodproducts" },
{ name: 'Recipes', href: 'daily-nutrition/recipes', id: "userrecipes" },
{ name: 'Daily Nutrition', href: 'daily-nutrition', id: "usernutrition" }]);
const [settings,setSettings] =useState([ { name: 'Logout'},{ name: 'Account', href: 'account'}]);
const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const LogoutClick=(param)=>{
    if(param=='Logout'){
      localStorage.clear();
      console.log('User has successfully logged out')
      window.location.reload(false);
    }
}
const AccountClick=(param)=>{
  if(param=='Account'){
    localStorage.clear();
    console.log('User has successfully logged out')
    window.location.reload(false);
  }
}
useEffect(() => {
  const getTokenFromLocalStorage = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
      setData({
        decodedToken: decodedToken,
        roles: decodedToken.roles,
        subroles: decodedToken.subroles
      });
      const isManagerOfFoodProduct = decodedToken.roles.includes('MANAGER') && decodedToken.subroles.includes('FOOD_PRODUCT');

      // Set pages based on the condition
      if (decodedToken.roles.includes('MANAGER') && decodedToken.subroles.includes('FOOD_PRODUCT')) {
        setPages([{ name: 'Food Products', href: 'manager/food-products', id: "foodproducts-manager" },
                  { name: 'Recipes Status', href: 'manager/recipes', id: "foodproducts-manager-recipe" }
        ]);
      } else if(decodedToken.roles.includes('CHEF')){
        setPages([{ name: 'Recipes', href: 'chef/recipes', id: "recipes-chef" }]);
      }
    }
  };

  getTokenFromLocalStorage();
}, []);







  return (
    <AppBar position="static" className="appBar2">
      <Container maxWidth="xl" className="appBar">
        <Toolbar disableGutters>
        <Typography variant="h6"noWrap component="a" href="/" >
          <img className="logo" src={companyLogo} alt="" />
            
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" aria-label="account of current user"aria-controls="menu-appbar"aria-haspopup="true"onClick={handleOpenNavMenu}color="inherit">
              <MenuIcon />
            </IconButton>
            
            <Menu id="menu-appbar"anchorEl={anchorElNav}anchorOrigin={{vertical: 'bottom',horizontal: 'left',}}keepMounted transformOrigin={{vertical: 'top',horizontal: 'left',}}open={Boolean(anchorElNav)}onClose={handleCloseNavMenu}sx={{display: { xs: 'block', md: 'none' },}}>
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" href="/" >
                    
                  <Button variant="contained"  className={page.id}  href={"/"+page.href} id={page.id}    key={page.name}>
                {page.name}
              </Button>
              
                    </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography variant="h5"noWrap component="a"href="/"sx={{mr: 2,display: { xs: 'flex', md: 'none' },flexGrow: 1,fontFamily: 'monospace',fontWeight: 700,letterSpacing: '.3rem',color: 'inherit',textDecoration: 'none',}}>
          <img className="logo" src={companyLogo} alt="" />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
        
            {pages.map((page) => (
             
              <Button href={"/"+page.href} id={page.id}  key={page.name}onClick={handleCloseNavMenu}sx={{ my: 2, color: 'white', display: 'block' }}>
                {page.name}
              </Button>
            ))}
          </Box>
          {data.decodedToken.email != null ?
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
  <Avatar alt="User Avatar" src={`https://ui-avatars.com/api/?name=${data.decodedToken.email.charAt(0)}&background=ffffff`} id="avatar"/>
</IconButton>
            </Tooltip>
           <Menu sx={{ mt: '45px' }}id="menu-appbar"anchorEl={anchorElUser}anchorOrigin={{vertical: 'top',horizontal: 'right',}}keepMounted transformOrigin={{vertical: 'top',horizontal: 'right',}}open={Boolean(anchorElUser)}onClose={handleCloseUserMenu}>
         
           {settings.map((setting) => (
             <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
              {setting.name !== 'Logout'?
               <Typography textAlign="center" href="/" >
               <Button   href={"/"+setting.href}   key={setting.name}>
             {setting.name}
           </Button>
                 </Typography>
              :
              <Typography textAlign="center" onClick={event => LogoutClick(setting.name)} >{setting.name}</Typography>

              }
               </MenuItem>
           ))}
         </Menu>
          </Box>
          :  <Button variant="contained"  className="appBarLoginBtn" href={"/login"}>Login<LoginIcon/></Button>
        }

        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;

