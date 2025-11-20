import React from 'react';
import { Button } from '@mui/material';

const NeoButton = ({ children, sx, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        border: '2px solid black',
        borderRadius: '0px', // Sharp corners
        boxShadow: '4px 4px 0px #000000', // Solid, offset shadow
        fontWeight: 'bold',
        fontFamily: '"Space Grotesk", sans-serif',
        color: 'black',
        backgroundColor: '#FFFBE6', // Cream background
        textTransform: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: '#f0f0f0',
            boxShadow: '6px 6px 0px #000000',
            transform: 'translate(-2px, -2px)', // Move up and left on hover
        },
        '&:active': {
            boxShadow: 'none',
            transform: 'translate(4px, 4px)', // "Press" down and right on click
        },
        ...sx, // Allow overriding styles
      }}
    >
      {children}
    </Button>
  );
};

export default NeoButton;