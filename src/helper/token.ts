/**
 * - this module will be used to securely generate and verify
 * json web tokens to provide authrized data access.
 */

import fs from "fs"
import path from "path"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const privateKey = fs.readFileSync(path.join(__dirname, "../../assets/keys/token/rsa_private.pem"), "utf8").trim()
const publicKey = fs.readFileSync(path.join(__dirname, "../../assets/keys/token/rsa_public.pem"), "utf8").trim()

function encrypt(data) {
  return crypto
    .publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      // We convert the data string to a buffer using `Buffer.from`
      Buffer.from(data)
    )
    .toString("base64")
}
function decrypt(data) {
  return crypto
    .privateDecrypt(
      {
        key: privateKey,
        // In order to decrypt the data, we need to specify the
        // same hashing function and padding scheme that we used to
        // encrypt the data in the previous step
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(data, "base64")
    )
    .toString()
}

/**
 * this generate token by algorithms [RS256] and Token Expiration 90 days
 * @param payload
 * @returns
 */
function generateToken(payload: any) {
  const encryptPayload = encrypt(JSON.stringify(payload))
  return jwt.sign({stkf: encryptPayload}, privateKey, {algorithm: "RS256", expiresIn: "90 days"})
}

/**
 * this function verify token
 * @param token
 * @returns
 */
function verify(token: any): any {
  return jwt.verify(token, publicKey, {algorithms: ["RS256"]}, (err, decodedToken) => {
    if (err) {
      return false
    } else {
      return JSON.parse(decrypt(decodedToken["stkf"]))
    }
  })
}

export = {
  generateToken,
  verify,
}
