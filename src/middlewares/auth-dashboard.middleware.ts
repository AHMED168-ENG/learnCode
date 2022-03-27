import httpStatus from "http-status"

export = (req, res, next) => {
  if (req.url.split("/")[1] == "dashboard") {
    const excluded = ["login"]
    if (excluded.indexOf(req.url.split("/")[3]) > -1) {
      return next()
    } else {
      return next()
      if (req.cookies.token) {
        return next()
      } else {
        res.redirect("/dashboard/user/login")
      }
    }
  } else {
    return next()
  }
}
