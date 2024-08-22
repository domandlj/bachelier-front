import React, { useState } from 'react';
import { Modal, Box, TextField, Typography } from '@mui/material';
import SquareButton from './SquareButton';

const ParamNameModal = ({ open, onClose, numParams, onSave }) => {
  const [names, setNames] = useState(Array(numParams).fill(''));

  const handleChange = (index, event) => {
    const newNames = [...names];
    newNames[index] = event.target.value;
    setNames(newNames);
  };

  const handleSave = () => {
    onSave(names);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        color: "grey",
        backgroundColor: "black",
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
          Enter Parameter Names
        </Typography>
        {Array.from({ length: numParams }).map((_, index) => (
          <TextField
            key={index}
            label={`Parameter ${index + 1}`}
            value={names[index]}
            onChange={(e) => handleChange(index, e)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              style: { color: "gray" },
            }}
            InputProps={{
              style: { color: "white", borderColor: "gray" },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'gray',
                },
                '&:hover fieldset': {
                  borderColor: 'gray',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'gray',
                },
              },
            }}
          />
        ))}
        <Box display="flex"
            gap={1}
            p={1}>
          <SquareButton onClick={onClose} text={"Close"}  />
          <SquareButton onClick={handleSave} text={"Save"}/>
        </Box>
      </Box>
    </Modal>
  );
};

export default ParamNameModal;
