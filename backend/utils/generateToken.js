import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generateAccessToken(user)  {
    //also called cookie token, this is the token that will be sent to the client and stored in the browser's local storage or cookies. It will be used to authenticate the user for subsequent requests to protected routes.
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });
}

export function generateRefreshToken(user) {
    //also called server token, this is the token that will be sent to the client and stored in the browser's cookies. It will be used to generate a new access token when the current access token expires. The refresh token has a longer expiration time than the access token.
    
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}