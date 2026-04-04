import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token." });
    }

    // attach user id to request
    req.id = decoded.userId;

    next();

  } catch (error) {
    console.log("Auth Middleware Error:", error);
    return res.status(401).json({ message: "Unauthorized. Token invalid or expired." });
  }
};

export default isAuthenticated;