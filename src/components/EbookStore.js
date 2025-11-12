import React from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Grid, 
  Box, 
  Divider,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import BuyNowButton from './BuyNowButton';
import { Link } from 'react-router-dom';

function EbookStore({ products, loading, error, user, authToken }) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Alert severity="info">No e-books available at the moment. Please check back later.</Alert>
      </Box>
    );
  }

  // Format price to display in a user-friendly way
  const formatPrice = (amount, currency) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2
    });
    
    return formatter.format(amount / 100); // Stripe amounts are in cents
  };

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        E-book Store
      </Typography>
      
      {!user && !authToken && (
        <Paper className="auth-banner" sx={{ mb: 4 }}>
          <Typography variant="body1">
            <strong>Guest purchases are welcome!</strong> You can buy and download immediately without signing up.
            However, guest downloads expire after 24 hours. For permanent access to your purchases, 
            consider <Link to="/signup" style={{ color: '#1976d2' }}>signing up</Link> or <Link to="/signin" style={{ color: '#1976d2' }}>signing in</Link>.
          </Typography>
        </Paper>
      )}

      <Grid container spacing={4} justifyContent="center">
        {products.map((product) => (
          <Grid item xs={12} md={8} key={product.id}>
            <Card className="ebook-card" elevation={3}>
              <CardContent className="ebook-content">
                <Typography variant="h4" component="h2" gutterBottom>
                  {product.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" paragraph>
                  {product.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                  <Typography variant="h5" className="price-tag">
                    {formatPrice(product.price.amount, product.price.currency)}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions className="ebook-actions" sx={{ p: 2 }}>
                <BuyNowButton 
                  product={product} 
                  onError={(msg) => alert(msg)}
                  user={user}
                />
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default EbookStore;