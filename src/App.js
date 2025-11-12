import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import EbookStore from './components/EbookStore';
import Success from './Success';
import Cancel from './Cancel';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Header from './components/Header';
import { paymentHelpers } from './lib/payments';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token'));

  useEffect(() => {
    // Fetch products
    const fetchProducts = async () => {
      try {
        const productsData = await paymentHelpers.getProducts();
        setProducts(productsData || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box className="app-container">
          <Header user={user} setUser={setUser} authToken={authToken} setAuthToken={setAuthToken} />
          <Container maxWidth="lg" className="main-content">
            <Routes>
              <Route 
                path="/" 
                element={
                  <EbookStore 
                    products={products} 
                    loading={loading} 
                    error={error} 
                    user={user}
                    authToken={authToken}
                  />
                } 
              />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/signin" element={<SignIn setUser={setUser} setAuthToken={setAuthToken} />} />
              <Route path="/signup" element={<SignUp setUser={setUser} setAuthToken={setAuthToken} />} />
            </Routes>
          </Container>
          <Box component="footer" className="footer">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} Simple E-book Store. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;