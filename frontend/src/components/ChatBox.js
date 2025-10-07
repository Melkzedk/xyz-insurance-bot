import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

function ChatBox({ messages }) {
  return (
    <Box    

        sx={{       
        height: "400px",
        overflowY: "auto",
        border: "1px solid #ccc",
        borderRadius: "8px",        
        padding: "16px",
        backgroundColor: "#f9f9f9",