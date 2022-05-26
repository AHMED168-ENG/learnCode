import path from "path"
import fs from "fs"
import sharp from "sharp"
import multer from "multer"

/**
 * This regular expression to validate an email address
 * Check if Email has the right syntax
 * @param email exempla@email.com
 * @returns boolean
 */
function regularExprEmail(email: string): boolean {
  const regularEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return regularEmail.test(email)
}
/**
 *  This function get 4 or 5 ex... digit random number
 *
 * here you can increse the min and max value this is for 4 digits
 * @param min default number 1000
 * @param max default number 9000
 * @returns digit random number
 */
function randomNumber(min: number = 1000, max: number = 9000) {
  return Math.floor(min + Math.random() * max)
}
function randomString(min: number = 1000, max: number = 9000) {
  return (Math.random() + 1).toString(36).substring(4)
}

/**
 * Function delete any property in interface
 * @param objectProps  data interface
 * @param props An array of property to be deleted
 * @returns data object
 */
function deleteProps(objectProps: object, props: string[]): object {
  const finalObject = objectProps
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < props.length; i++) {
    if (props[i] in finalObject) {
      finalObject[props[i]] = undefined
      delete finalObject[props[i]]
    }
  }
  return finalObject
}
/**
 * To check if keys in object
 * @param obj the object that will be test
 * @param props array of keys for check
 * @returns true OR false
 */
function checkFields(obj: object, props: string[]) {
  for (const key of props) {
    if (!obj.hasOwnProperty(key) || obj[key] == null || obj[key] === undefined) {
      return false
    } else if (typeof obj[key] == "string" && (obj[key] == "" || obj[key].trim == "")) {
      return false
    }
  }
  return true
}
/**
 * Image processing and save in dir
 * @param filePath Folder path in -public-
 * @param imgName Generate from timestamp and random number
 * @param data Image file ( Buffer )
 */
function imageProcessing(filePath: string, imgName: string, data) {
  const pathDir = path.join(__dirname, `../../public/${filePath}/`)
  const ext: string = path.extname(imgName)
  if (!fs.existsSync(pathDir)) {
    fs.mkdirSync(pathDir, {recursive: true})
  }
  if (ext == ".jpg" || ext == ".jpeg") {
    sharp(data)
      .jpeg({quality: 80})
      .resize(1000)
      .toFile(`${pathDir}${imgName}`)
      .then(() => fs.writeFile(`${pathDir}o_${imgName}`, data, "ascii", () => {}))
  } else {
    sharp(data)
      .png({quality: 80})
      .resize(1000)
      .toFile(`${pathDir}${imgName}`)
      .then(() => fs.writeFile(`${pathDir}o_${imgName}`, data, "ascii", () => {}))
  }
}
/**
 * To remove img
 * @param filePath Relative path of file
 */
function removeFile(filePath: string) {
  const ext: string = path.extname(filePath)
  const pathDir = path.join(__dirname, `../../public/${filePath}`)
  const pathDir_o = path.join(__dirname, `../../public/${path.dirname(filePath)}/o_${path.basename(filePath)}`)
  if (fs.existsSync(pathDir) && filePath != "" && filePath != null && (ext == ".jpg" || ext == ".jpeg" || ext == ".png")) {
    fs.unlink(pathDir, () => {})
    fs.unlink(pathDir_o, () => {})
  }
}
const mimetypeImge: string[] = ["image/jpg", "image/jpeg", "image/png"]
const videoStorage = multer.diskStorage({
  destination: 'videos',
  filename: (req, file, cb) => { if (req.params.mediaType === 'video') cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname)); },
});
const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 10000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) return cb(new Error('Please upload a video'));
    cb(undefined, true);
  }
});
export default {regularExprEmail, randomNumber, randomString, deleteProps, checkFields, imageProcessing, removeFile, mimetypeImge, videoUpload}
