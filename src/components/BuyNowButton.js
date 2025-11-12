// Buy Now Button Component
import React, { useState } from 'react';
import { Button } from '@mui/material';
import { paymentHelpers } from '../lib/payments';

function BuyNowButton({ product, onSuccess, onError, user }) {
  const [loading, setLoading] = useState(false);

  const handleBuyNow = async () => {
    if (!product) {
      onError?.('No product selected');
      return;
    }

    // Extract price ID from product
    let priceId = null;
    if (typeof product.price === 'string') {
      priceId = product.price;
    } else if (product.default_price?.id) {
      priceId = product.default_price.id;
    } else if (product.price?.id) {
      priceId = product.price.id;
    }

    if (!priceId) {
      onError?.('Product price not available');
      return;
    }

    setLoading(true);
    try {
      await paymentHelpers.redirectToCheckout(priceId, {
        // Add customer email if user is authenticated
        customerEmail: user?.email
      });
    } catch (error) {
      console.error('Checkout error:', error);
      onError?.(error.message || 'Failed to start checkout');
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBuyNow}
      disabled={loading}
      variant="contained"
      color="primary"
      size="large"
      fullWidth
    >
      {loading ? 'Processing...' : 'Buy Now'}
    </Button>
  );
}

export default BuyNowButton;