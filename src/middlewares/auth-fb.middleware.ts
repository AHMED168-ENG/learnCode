import axios from "axios"

export const fbTokenInfo = async (token) => {
  let data = null
  await axios
    .get(`https://graph.facebook.com/me`, {
      params: {
        fields: ["id", "email", "name"].join(","),
        access_token: token,
      },
    })
    .then((d) => data = d.data)
    .catch(() => (data = null))
  return data
}
