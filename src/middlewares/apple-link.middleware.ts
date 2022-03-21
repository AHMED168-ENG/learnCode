import path from "path"
import fs from "fs"

export = (req, res) => {
  const aasa = fs.readFileSync(path.join(__dirname, "../../assets/apple/apple-app-site-association"), "utf8")
  //   res.set("Content-Type", "application/pkcs7-mime")
  res.status(200).json(JSON.parse(aasa))
}
