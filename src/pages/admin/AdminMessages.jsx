import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

const AdminMessages = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Quản lý tin nhắn
      </Typography>
      <Box>{/* Add message content here */}</Box>
    </Paper>
  );
};

export default AdminMessages;
