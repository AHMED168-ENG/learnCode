import httpStatus from "http-status"

export = (req, res, next) => {
  const excluded = ["login", "register"]
  if (excluded.indexOf(req.url.split("/")[3]) > -1 || excluded.indexOf(req.url.split("/")[2]) > -1) {
    return next()
  } else {
    if (req.cookies.token) {
      return next()
    } else {
      res.redirect("/dashboard/admin/login")
    }
  }
}
