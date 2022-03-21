import Token from "../helper/token"
import httpStatus from "http-status"

export = (req, res, next) => {
  if (req.url.split("/")[1] == "v1") {
    const excluded = ["login", "signup", "verifyOtp", "sendOtp", "find", "resetPassword", "google", "facebook", "certificate"]
    // get the language from the header if present or default language [ar]
    req.lang = req.headers.lang ? req.headers.lang : process.env.LANGUAGE
    if (excluded.indexOf(req.url.split("/")[3]) > -1) {
      return next()
    } else {
      // get the token from the header if present
      const token = req.headers["x-auth-token"] || req.headers["authorization"]
      // if no token found, return response (without going to the next middelware)
      if (!token)
        return res.status(httpStatus.UNAUTHORIZED).json({
          err: httpStatus.UNAUTHORIZED,
          msg: "Authorization error",
          code: 52589,
        })
      try {
        // if can verify the token, set req.user and pass to next middleware
        if (Token.verify(token) == false) {
          return res.status(httpStatus.UNAUTHORIZED).json({err: httpStatus.UNAUTHORIZED, msg: "Authorization error", code: 235645})
        } else {
          req.user = Token.verify(token)
          next()
        }
      } catch (error) {
        // if invalid token
        return res.status(httpStatus.UNAUTHORIZED).json({err: httpStatus.UNAUTHORIZED, msg: "Authorization error", code: 858445})
      }
    }
  } else {
    return next()
  }
}
