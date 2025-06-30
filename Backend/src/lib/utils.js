import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d Ms
    httpOnly: true, // prevent Xss attacks cross-site scripting
    sameSite: "strict", // CSRF attacks cross-site request
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
