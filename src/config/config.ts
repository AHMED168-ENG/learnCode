import dotenv from "dotenv"
import path from "path"

dotenv.config({
  path: process.argv[2] == "dev" ? path.join(__dirname, "../../dev.env") : path.join(__dirname, "../../test.env"),
})

/**
 * environment file interface
 */
export interface IEnv {
  port: number | string
  database: [string, string, string, object] // DB_Name , User , DB_PW , {host,dialect}
  mail: object
}

const env: IEnv = {
  port: Number(process.env.NODE_SERVER_PORT),
  database: [
    process.env.database,
    process.env.username_DB,
    process.env.password || null,
    {
      host: process.env.host,
      dialect: "mysql",
      logging: false,
      dialectOptions: {
        supportBigNumbers: true,
        decimalNumbers: true,
        bigNumberStrings: false,
      },
      // TODO: remove sync in product
      sync: true,
    },
  ],
  mail: {
    pool: true,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  },
}

export default env
