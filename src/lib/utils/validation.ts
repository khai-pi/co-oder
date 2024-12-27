import { UserInput } from "@/types/user";

export const validateUserInput = (
  input: UserInput
): { isValid: boolean; error?: string } => {
  if (!input.email || !input.email.includes("@")) {
    return { isValid: false, error: "Invalid email address" };
  }

  if (!input.password || input.password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  if (!input.username || input.username.trim().length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters long" };
  }

  return { isValid: true };
};
