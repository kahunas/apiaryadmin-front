import { RegisterForm } from "@/types/requests/auth";

export const validateRegisterForm = (formData: RegisterForm) => {
  const errors: Partial<RegisterForm> = {};

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (!formData.username.trim()) {
    errors.username = "Username is required";
  }

  if (!formData.password.trim()) {
    errors.password = "Password is required";
  } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
