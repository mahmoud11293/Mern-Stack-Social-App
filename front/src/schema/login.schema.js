import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  // .regex(
  //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*?[@$!%*#?&-]).{8,}/,
  //   "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  // ),
});
