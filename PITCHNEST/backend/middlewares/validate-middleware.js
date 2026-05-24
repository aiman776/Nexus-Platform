// middlewares/validateSchema.js

const validate = (schema) => async (req, res, next) => {
  try {
    // Validate body against the schema
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next(); // If validation passes, move to next middleware/controller
  } 
  catch (err) {
        // If validation fails, return error response
  const message = err.errors?.[0]?.message || "Validation failed";
  console.log(message);
  res.status(400).json({ msg: message });
}
};

module.exports = validate;
