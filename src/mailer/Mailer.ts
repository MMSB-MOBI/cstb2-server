import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Twig from 'twig';

interface DefaultSenderInterface {
  name: string;
  address: string;
}

class Mailer {
  mailer_transport_settings: SMTPTransport.Options;
  default_sender: DefaultSenderInterface;
  server_url: string;
  template_dir: string;
  mailer_enforce_recipient: string;
  protected transporter: any;

  constructor(
    mailer_transport_settings: any,
    default_mailer_name: string,
    default_mailer_address: string,
    server_url: string,
    template_dir: string,
    mailer_enforce_recipient: string,
  ) {
    /*const transportSettings2 = (SMTPTransport.Options = {
      host: mailer_transport_settings.host,
      port: mailer_transport_settings.port,
      secure: mailer_transport_settings.secure, // true for 465, false for other ports
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: mailer_transport_settings.tsl.rejectUnauthorized,
      },
    });*/

    //console.log("ts2", transportSettings2)

    this.transporter = nodemailer.createTransport(mailer_transport_settings);
    this.default_sender = {
      name: default_mailer_name,
      address: default_mailer_address,
    };
    this.server_url = server_url;
    this.template_dir = template_dir;
    this.mailer_enforce_recipient = mailer_enforce_recipient;
  }

  async send(
    send_options: nodemailer.SendMailOptions,
    template_name: string,
    options: { [variableName: string]: any },
  ) {
    if (!send_options.to) {
      throw new Error('You must define a mail recipient.');
    }

    if (!options.site_url) {
      options.site_url = this.server_url;
    }
    if (!options.static_site_url) {
      options.static_site_url = this.server_url;
    }

    const file =
      this.template_dir +
      template_name +
      (template_name.endsWith('.twig') ? '' : '.twig');

    const content = (await new Promise((resolve, reject) => {
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

    if (this.mailer_enforce_recipient) {
      send_options.to = this.mailer_enforce_recipient;
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
}

export function mailerFactory(
  mailer_transport_settings: SMTPTransport.Options,
  default_mailer_name: string,
  default_mailer_address: string,
  server_url: string,
  template_dir: string,
  mailer_enforce_recipient = '',
) {
  return new Mailer(
    mailer_transport_settings,
    default_mailer_name,
    default_mailer_address,
    server_url,
    template_dir,
    mailer_enforce_recipient,
  );
}
