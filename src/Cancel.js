// Cancel page shown if payment is cancelled
import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button 
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Cancel() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <WarningIcon color="warning" sx={{ fontSize: 64 }} />
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Payment Cancelled
        </Typography>
        <Typography variant="body1" paragraph>
          Your payment was cancelled. No charges were made to your account.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
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

export default Cancel;