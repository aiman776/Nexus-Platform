const { z } = require("zod");

const signup_schema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(255, { message: "Username must not be more than 255 characters" }),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Please enter a valid email address" })
    .min(3, { message: "Email must be at least 3 characters" })
    .max(255, { message: "Email must not be more than 255 characters" }),

  phone: z
    .string({ required_error: "Phone number is required" })
    .trim()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number must not be more than 15 digits" }),

  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(255, { message: "Password must not be more than 255 characters" }),

  age: z
    .string({ required_error: "Age is required" })
    .trim()
    .min(1, { message: "Age must be at least 1 digit" })
    .max(3, { message: "Age must not be more than 3 digits" }),

  // ✅ Role field add kiya
  role: z
    .enum(["entrepreneur", "investor"], {
      message: "Role must be entrepreneur or investor"
    })
    .default("entrepreneur"),
});

module.exports = signup_schema;