// Success page shown after successful payment
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { paymentHelpers } from './lib/payments';

function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id'); // Stripe checkout session ID
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [authToken, setAuthToken] = useState(localStorage.getItem('auth_token'));
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Load products to show what was purchased
    const fetchData = async () => {
      try {
        const productsData = await paymentHelpers.getProducts();
        setProducts(productsData || []);
        
        // If user is authenticated, load their purchases
        if (authToken) {
          const userPurchases = await paymentHelpers.getMyPurchases(authToken);
          setPurchases(userPurchases || []);
        } else {
          // For guest purchases, verify purchase using session ID
          // Use the first product since we only have one e-book
          const productId = productsData[0]?.id;
          
          if (productId && sessionId) {
            // Verify purchase using checkout session ID (works for guests!)
            const verification = await paymentHelpers.verifyPurchase(productId, null, sessionId);
            if (verification.hasPurchased) {
              // Create a purchase object for display
              const product = productsData.find(p => p.id === productId);
              if (product) {
                setPurchases([{
                  productId: product.id,
                  productName: product.name,
                  purchaseDate: verification.purchaseDate,
                  amount: verification.amount || 0,
                  currency: verification.currency || 'usd',
                  isGuestPurchase: true // Flag to indicate guest purchase
                }]);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load purchase information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, sessionId]);

  const handleDownload = async (productId, isGuestPurchase = false) => {
    try {
      if (isGuestPurchase && sessionId) {
        // Guest purchase: use checkout session ID (works immediately, no sign-up required!)
        await paymentHelpers.downloadProduct(productId, null, sessionId);
      } else if (authToken) {
        // Authenticated user: use auth token
        await paymentHelpers.downloadProduct(productId, authToken);
      } else {
        alert('Please sign in to download, or use the checkout session link');
      }
    } catch (error) {
      alert(error.message || 'Failed to download');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <CheckIcon color="success" sx={{ fontSize: 64 }} />
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="body1" paragraph>
          Thank you for your purchase. Your payment has been processed successfully.
        </Typography>
        
        {/* Show message for guest purchases */}
        {!authToken && sessionId && (
          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="body2">
              <strong>Guest Purchase:</strong> You can download immediately below. 
              For permanent access, consider signing up (downloads expire after 24 hours for guests).
            </Typography>
          </Alert>
        )}
        
        {sessionId && (
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Order ID: {sessionId}
          </Typography>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        {/* Show purchased products with download buttons */}
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : purchases.length > 0 ? (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Your Purchase
            </Typography>
            {purchases.map(purchase => (
              <Paper key={purchase.productId} variant="outlined" sx={{ p: 3, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {purchase.productName}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Purchased: {new Date(purchase.purchaseDate).toLocaleDateString()}
                </Typography>
                {purchase.isGuestPurchase && (
                  <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
                    Guest purchase - download expires in 24 hours
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDownload(purchase.productId, purchase.isGuestPurchase)}
                >
                  Download E-book
                </Button>
              </Paper>
            ))}
          </Box>
        ) : (
          <Box>
            <Typography variant="body1" color="textSecondary" paragraph>
              Your purchase is being processed. Please wait a moment.
            </Typography>
            {authToken && (
              <Typography variant="body2" color="primary" paragraph>
                If you completed checkout in a new tab, click the "Refresh Purchases" button below to check for new purchases.
              </Typography>
            )}
          </Box>
        )}
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          {authToken && (
            <Button 
              variant="contained" 
              color="secondary"
              onClick={fetchPurchaseData}
              disabled={refreshing}
              size="large"
            >
              {refreshing ? 'Refreshing...' : 'Refresh Purchases'}
            </Button>
          )}
          <Button 
            variant="outlined" 
            component={Link} 
            to="/"
            size="large"
          >
            Return to Store
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Success;