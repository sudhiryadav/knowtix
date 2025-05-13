declare module 'nodemailer-express-handlebars' {
  import { Transporter } from 'nodemailer';
  
  interface HandlebarsOptions {
    viewEngine: {
      extName: string;
      partialsDir: string;
      defaultLayout: boolean;
    };
    viewPath: string;
    extName: string;
  }

  function hbs(options: HandlebarsOptions): any;
  export = hbs;
} 