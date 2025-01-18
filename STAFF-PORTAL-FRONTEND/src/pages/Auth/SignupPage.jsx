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
  Grid,
} from "@mui/material";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { authService } from "../../services/api/auth.service";

const SignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

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
    if (!formData.username) {
      newErrors.username = "Username is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      // Check password strength
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumbers = /\d/.test(formData.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
      const isLongEnough = formData.password.length >= 8;

      if (!isLongEnough) {
        newErrors.password = "Password must be at least 8 characters long";
      } else if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
        newErrors.password = 
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
      }
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...signupData } = formData;
      await authService.signup(signupData);
      navigate("/login", { 
        state: { 
          message: "Registration successful! Please check your email to verify your account." 
        } 
      });
    } catch (error) {
      setErrors({
        submit: error.message,
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
            Create Account
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "var(--color-text-primary)", mb: 4 }}
          >
            Sign up to get started with Staff Portal
          </Typography>

          {errors.submit && (
            <Alert severity="error" sx={{ mb: 3, width: "100%" }}>
              {errors.submit}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiUser className="text-[var(--color-text-primary)]" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "var(--color-text-secondary)",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--color-border-primary)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "var(--color-text-primary)",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
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
                    "& .MuiInputLabel-root": {
                      color: "var(--color-text-secondary)",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--color-border-primary)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "var(--color-text-primary)",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
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
                          sx={{ color: "var(--color-text-primary)" }}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "var(--color-text-secondary)",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--color-border-primary)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "var(--color-text-primary)",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
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
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          sx={{ color: "var(--color-text-primary)" }}
                        >
                          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiInputLabel-root": {
                      color: "var(--color-text-secondary)",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--color-border-primary)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--color-primary-500)",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "var(--color-text-primary)",
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1976D2 30%, #00B4D8 90%)",
                },
              }}
            >
              Sign Up
            </Button>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Divider sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--color-text-primary)" }}
                >
                  OR
                </Typography>
              </Divider>

              <Typography
                variant="body2"
                sx={{ color: "var(--color-text-primary)" }}
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "var(--color-primary-500)",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignupPage;
