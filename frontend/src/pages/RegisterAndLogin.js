import * as React from 'react';
import { useState,useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { signIn, signUp, resetPassword } from "../api/FirebaseAPI";

function RegisterAndLogin() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);
  const history = useNavigate();


  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      history("/");
    }
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isSignIn) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      if (localStorage.getItem("accessToken")) {
        window.location.reload();
      }
      
      //history.goBack();
      history("/");
    
    } catch (error) {
      alert(error.code);
    }

  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordClicked(true);
  };

  const handleSendPasswordReset = async (event) => {
    event.preventDefault();
    try {
      await resetPassword(event.target.email.value);
      alert("Password reset email sent. Check your inbox.");
      setForgotPasswordClicked(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isSignIn ? 'Sign in' : 'Sign up'}
          </Typography>
          {forgotPasswordClicked ? (
            <Box>
              <Typography variant="h6">Forgot Password</Typography>
              <form onSubmit={handleSendPasswordReset}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Send Reset Email
                </Button>
              </form>
              <Button onClick={() => setForgotPasswordClicked(false)}>Back to Sign In</Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value={false} color="primary"  />} // GDPR Checkbox
                label="I agree to GDPR compliance"
              />
               <Button variant="outlined" color="primary">
                    View Terms and Conditions
                  </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                id="actionButton"
                sx={{ mt: 3, mb: 2 }}
              >
                {isSignIn ? 'Sign In' : 'Sign Up'}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" onClick={handleForgotPasswordClick}>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Button onClick={toggleForm} variant="text" color="primary">
                    {isSignIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default RegisterAndLogin;


