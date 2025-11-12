import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  Container,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { authHelpers } from '../lib/supabase';

function Header({ user, setUser, authToken, setAuthToken }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      if (authToken) {
        await authHelpers.signOut(authToken);
      }
      localStorage.removeItem('auth_token');
      setAuthToken(null);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'white',
              textDecoration: 'none',
              flexGrow: 1
            }}
          >
            Simple E-book Store
          </Typography>

          <Box>
            {authToken ? (
              <Button 
                color="inherit" 
                onClick={handleSignOut}
                size={isMobile ? 'small' : 'medium'}
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/signin"
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ mr: 1 }}
                >
                  Sign In
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/signup"
                  size={isMobile ? 'small' : 'medium'}
                  variant="outlined"
                  sx={{ 
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.8)',
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;