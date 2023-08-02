import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { resetPassword } from "../../store/authActions";
import { useNavigate, useLocation } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

const ResetPassword = ({ resetPassword }) => {
  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { new_password, confirm_password } = formData;
  const resetToken = new URLSearchParams(location.search).get("token");
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (new_password === confirm_password) {
        resetPassword(resetToken, new_password, navigate);
    } else {
        // Handle password mismatch
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <VpnKeyIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="new_password"
              value={new_password}
              onChange={onChange}
              label="New Password"
              type="password"
              id="new_password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm_password"
              value={confirm_password}
              onChange={onChange}
              label="Confirm Password"
              type="password"
              id="confirm_password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

ResetPassword.propTypes = {
    resetPassword: PropTypes.func.isRequired,
};


export default connect(null, { resetPassword })(ResetPassword);
