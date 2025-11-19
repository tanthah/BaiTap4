import { registerService, loginService, forgotPasswordService, resetPasswordService } from "../services/authService.js";

export const register = async (req, res) => {
  const result = await registerService(req.body);
  return res.json(result);
};

export const login = async (req, res) => {
  const result = await loginService(req.body);
  return res.json(result);
};

export const forgotPassword = async (req, res) => {
  const result = await forgotPasswordService(req.body.email);
  return res.json(result);
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const result = await resetPasswordService(token, password);
  return res.json(result);
};
