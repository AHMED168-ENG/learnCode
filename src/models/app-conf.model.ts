import config from "../config/config"
import {Sequelize, DataTypes} from "sequelize"
import webAppsUsers from "./user.model"

const sequelize = new Sequelize(...config.database)

const AppConfModel = sequelize.define(
  "conf_app_data",
  {
    id_config: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    app_ar_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        is: {
          args: new RegExp("/^[\u0600-۾](s)?(p{Pd})?/"),
          msg: "The provided arabic name should only contain valid arabic characters and punctuation",
        },
      },
    },
    app_en_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: new RegExp("[\u0000-~\u2000-\u206e](s)?p{Pd}s?"),
          msg: "The provided english name should only contain valid english charaters and punctuation",
        },
      },
    },
    abbreviation_ar_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: new RegExp("/^[\u0600-۾](s)?(p{Pd})?/"),
          msg: "The provided abbreviation arabic name should only contain valid arabic characters and punctuation",
        },
      },
    },
    abbreviation_en_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: new RegExp("[\u0000-~\u2000-\u206e](s)?p{Pd}s?"),
          msg: "The provided abbreviation english name should only contain valid english charaters and punctuation",
        },
      },
    },
    slogan: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: new RegExp("[\u0000-~\u2000-\u206e](s)?p{Pd}s?"),
          msg: "The provided slogan should only contain valid english charaters and punctuation",
        },
        len: {
          args: [0, 200],
          msg: "Invalid slogan length",
        },
      },
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        isUrl: {
          msg: "Invalid website",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        isEmail: {
          msg: "Invalid email",
        },
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        is: {
          args: new RegExp("[\u0000-~\u2000-\u206e](s)?p{Pd}s?"),
          msg: "The provided slogan should only contain valid english charaters and punctuation",
        },
      },
    },
    telephone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
          msg: "Invalid telephone",
        },
      },
    },
    fax: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
          msg: "Invalid fax",
        },
      },
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/,
          msg: "Invalid base64 logo",
        },
        len: {
          args: [0, 255],
          msg: "Logo is too large",
        },
      },
    },
    footerAr: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        len: {
          args: [0, 255],
          msg: "Footer is too large",
        },
      },
    },
    footerEn: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        len: {
          args: [0, 255],
          msg: "Footer is too large",
        },
      },
    },
    footerImg: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        len: {
          args: [0, 100],
          msg: "Footer is too large",
        },
      },
    },
    keywords: {
      type: DataTypes.STRING(400),
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: new RegExp("[\u0000-~\u2000-\u206e](s)?p{Pd}s?"),
          msg: "Invalid keywords characters",
        },
        len: {
          args: [0, 400],
          msg: "Keywords are too large",
        },
      },
    },
    metatext: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        is: {
          args: new RegExp("[\u0000-~\u2000-\u206e](s)?p{Pd}s?"),
          msg: "Invalid keywords characters",
        },
      },
    },
    facebook: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        isUrl: {
          msg: "Invalid url",
        },
        is: {
          args: /^(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/,
          msg: "Invalid facebook link",
        },
      },
    },
    twitter: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        isUrl: {
          msg: "Invalid url",
        },
        is: {
          args: /(?:http:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
          msg: "Invalid twitter url",
        },
      },
    },
    instagram: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        isUrl: {
          msg: "Invalid url",
        },
        is: {
          args: /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/,
          msg: "Invalid instagram url",
        },
      },
    },
    // TODO: Remove G+
    google_plus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      validate: {
        isUrl: {
          msg: "Invalid url",
        },
        // TODO: Check for this later on
        // is: {
        //     args: /(?:http:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
        //     msg: "Invalid google+ url"
        // }
      },
    },
    google_maps: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: {
          msg: "Invalid url",
        },
        is: {
          args: /^https?\:\/\/(www\.|maps\.)?google(\.[a-z]+){1,2}\/maps\/?\?([^&]+&)*(ll=-?[0-9]{1,2}\.[0-9]+,-?[0-9]{1,2}\.[0-9]+|q=[^&]+)+($|&)/,
          msg: "Invalid google maps url",
        },
      },
    },
    image: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/,
          msg: "Invalid base64 image",
        },
        len: {
          args: [0, 300],
          msg: "Image is too large",
        },
      },
    },
    summary_ar: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: new RegExp("/^[\u0600-۾](s)?(p{Pd})?/"),
          msg: "The provided arabic summary should only contain valid arabic characters and punctuation",
        },
      },
    },
    summary_en: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
      validate: {
        is: {
          args: new RegExp("[\u0000-~\u2000-\u206e](s)?p{Pd}s?"),
          msg: "The provided english summary should only contain valid english characters and punctuation",
        },
      },
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
)

AppConfModel.sync()

export default AppConfModel
