import nodemailer from "nodemailer"
import hbs from "handlebars"
import path from "path"
import fs from "fs"
import config, {IEnv} from "../config/config"

const mailConf: any = config.mail

/**
 * @function sendEmail This function send email
 * @param to Comma separated list or an array of recipients email addresses that will appear on the To: field
 * @param subject  The subject of the email
 * @param templateDate Contains data that is passed to a template
 * @param templateName The name file template is constent HTML (templates => type .hbs)
 * @param text The plaintext version of the message
 * @param cc Comma separated list or an array of recipients email addresses that will appear on the Cc: field
 * @param bcc Comma separated list or an array of recipients email addresses that will appear on the Bcc: field
 * @returns Promise<any>
 */
function sendMail(to: string[], subject: string, template: string, args?: object, cc?: string[], bcc?: string[]): Promise<any> {
  // return promise boolean [resolve => true , reject => false]
  return new Promise<any>((resolve, reject) => {
    // this check array to is less Than 1 return reject
    if (to.length < 1) return reject({error: {message: "can not send email to unknown or undefined value"}})
    // this configuration Mailer
    const configMailer = nodemailer.createTransport(mailConf)
    // Message object
    const mail = {
      from: mailConf.auth.user,
      to: to,
      subject: subject,
      html: generate(template, args).html, // this handlebars template and pass data template
      //   text: generate(template, lang, args).text,
      cc,
      bcc,
      attachments: [...generate(template, args).attachments],
    }
    configMailer
      .sendMail(mail)
      .then((result) => {
        return resolve(result)
      })
      .catch((error) => {
        configMailer.close()
        // to function create or update email
        return reject({mail: error}) // to return to the user error if email not sent NOTE after adding document to email tracker
      })
  })
}

function generate(template, args): {html: string; attachments: object[]} {
  //  let templateName = new EmailTemplate(path.join(__dirname,'../utils/templateEmail',lang, template));
  let templateName = fs.readFileSync(path.join(__dirname, `../../assets/Email-template/${template}.hbs`), "utf8")
  // let templatetext =fs.readFileSync( path.join(__dirname,`../utils/templateEmail/${lang}/${template}/text.txt`),"utf8");
  // console.log(path.join(__dirname, `../utils/templateEmail/${lang}/${template}/html.hbs`), "utf8")
  // console.log(__dirname + "../../assets/logo.png")
  return {
    html: hbs.compile(templateName)(args), // the Handlebar compiled template,
    // text: hbs.compile(templatetext)(args), // the short text for the email,
    attachments: [
      {
        path: path.join(__dirname, "../../assets/logo/logo_for_email.png"),
        cid: "logo",
      },
    ],
  }
}

export default sendMail


// {
//   mail: Error: connect ECONNREFUSED 142.250.102.109:465
//       at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1161:16) {
//     errno: -111,
//     code: 'ECONNECTION',
//     syscall: 'connect',
//     address: '142.250.102.109',
//     port: 465,
//     command: 'CONN'
//   }
// }
