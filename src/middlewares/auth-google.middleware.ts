import {Request, Response} from "express"
import {OAuth2Client} from "google-auth-library"

import axios from "axios"

export const googleTokenInfo = async (token) => {
  let data = null
  await axios
    .get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
    .then((d) => (data = d.data))
    .catch(() => (data = null))
  return data
}
