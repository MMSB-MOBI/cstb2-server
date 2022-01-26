import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Twig from 'twig';
import path from 'path';

const TEMPLATE_DIR = path.resolve(__dirname, '../../templates/') + '/'
const SERVER_URL = 'http://localhost:8080';
const DEFAULT_MAILER_NAME = 'CSTB';
const DEFAULT_MAILER_ADDRESS = 'cstb@ibcp.fr';
const MAILER_ENFORCE_RECIPIENT = false; 
const MAILER_TRANSPORT_SETTINGS = SMTPTransport.Options = {
  host: 'smtp.ibcp.fr',
  port: 587,
  secure: false, // true for 465, false for other ports
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
};

export default new class Mailer {
  protected transporter = nodemailer.createTransport(MAILER_TRANSPORT_SETTINGS);

  public default_sender = {
    name: DEFAULT_MAILER_NAME,
    address: DEFAULT_MAILER_ADDRESS,
  };

  async send(
    send_options: nodemailer.SendMailOptions,
    template_name: string,
    options: { [variableName: string]: any },
  ) {
    if (!send_options.to) {
      throw new Error('You must define a mail recipient.');
    }

    if (!options.site_url) {
      options.site_url = SERVER_URL;
    }
    if (!options.static_site_url) {
      options.static_site_url = SERVER_URL;
    }

    const file =
      TEMPLATE_DIR +
      template_name +
      (template_name.endsWith('.twig') ? '' : '.twig');

    const content = (await new Promise((resolve, reject) => {
      // @ts-ignore Incorrect typedef for options
      Twig.renderFile(file, options, (err: Error, res: string) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    })) as string;

    send_options.html = content;

    if (!send_options.from) {
      send_options.from = this.default_sender;
      send_options.sender = this.default_sender;
    }
    if (!send_options.subject && options.title) {
      send_options.subject = options.title;
    }

    if (MAILER_ENFORCE_RECIPIENT) {
      send_options.to = MAILER_ENFORCE_RECIPIENT;
    }

    return this.mail(send_options);
  }

  protected async mail(options: nodemailer.SendMailOptions) {
    try {
      const info = await this.transporter.sendMail(options);

      console.log('Sended email:' + info.messageId);
      return info as { messageId: string };
    } catch (e) {
      console.error('Unable to send email to ' + options.sender + ' / ' + e);
      console.log(options);
      console.log(e);

      throw new Error('Unable to send email.');
    }
  }
}();
