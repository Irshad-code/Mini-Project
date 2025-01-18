import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { authService } from "../../services/api/auth.service";
import { useUser } from "../../contexts/UserContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [requiresPasswordReset, setRequiresPasswordReset] = useState(false);
  const [resetToken, setResetToken] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await authService.login(formData);
      
      if (response.requiresPasswordReset) {
        setRequiresPasswordReset(true);
        setResetToken(response.resetToken);
        setErrors({
          submit: response.message
        });
        navigate(`/reset-password?token=${response.resetToken}`);
        return;
      }

      login({
        username: response.username,
        email: response.email,
        role: response.role,
        department: response.department,
        userId: response.userId,
      });

      navigate("/dashboard");
    } catch (error) {
      setErrors({
        submit: error.message
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "var(--color-bg-secondary)",
        py: 12,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "var(--color-bg-primary)",
            borderRadius: 2,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 600,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              backgroundClip: "text",
              textFillColor: "transparent",
            }}
          >
            Welcome Back
          </Typography>

          <Typography variant="body1" sx={{ color: 'var(--color-text-primary)', mb: 4 }}>
            Sign in to access your account
          </Typography>

          {errors.submit && (
            <Alert severity="error" sx={{ mb: 3, width: "100%" }}>
              {errors.submit}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiMail className="text-[var(--color-text-primary)]" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiInputLabel-root': {
                  color: 'var(--color-text-secondary)',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--color-border-primary)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--color-primary-500)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--color-primary-500)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'var(--color-text-primary)',
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiLock className="text-[var(--color-text-primary)]" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'var(--color-text-primary)' }}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiInputLabel-root': {
                  color: 'var(--color-text-secondary)',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--color-border-primary)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--color-primary-500)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--color-primary-500)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'var(--color-text-primary)',
                },
              }}
            />

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Link
                to="/forgot-password"
                style={{
                  color: 'var(--color-primary-500)',
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                '&:hover': {
                  background: "linear-gradient(45deg, #1976D2 30%, #00B4D8 90%)",
                }
              }}
            >
              Sign In
            </Button>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Divider sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                  OR
                </Typography>
              </Divider>
              
              <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  style={{
                    color: 'var(--color-primary-500)',
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
