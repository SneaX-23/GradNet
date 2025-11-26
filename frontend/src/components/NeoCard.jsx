import React from 'react';
import { Card } from '@mui/material';

const NeoCard = ({ children, sx, ...props }) => {
  return (
    <Card
      {...props}
      sx={{
        border: '2px solid black',
        borderRadius: '0px',
        boxShadow: '4px 4px 0px #000000',
        backgroundColor: '#FFFBE6',
        padding: 2,
        ...sx,
      }}
    >
      {children}
    </Card>
  );
};

export default NeoCard;