const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

module.exports = {
  friendlyName: "Send mail",

  description: "",

  inputs: {
    options: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: sails.config.custom.gmail.user || process.env.GMAIL_USER,
        pass: sails.config.custom.gmail.password || process.env.GMAIL_PASSWORD,
      },
    });

    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extName: ".hbs",
          partialsDir: "views/email",
          layoutsDir: "views/email",
          defaultLayout: "",
        },
        viewPath: "views/email",
        extName: ".hbs",
      }),
    );

    try {
      let emailOptions = {
        from: "Sails CRUD App <alert@sails.com>",
        ...inputs.options,
      };

      await transporter.sendMail(emailOptions);
    } catch (error) {
      sails.log(error);
    }
  },
};
