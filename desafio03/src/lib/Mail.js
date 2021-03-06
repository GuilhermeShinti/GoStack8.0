import nodemailer from 'nodemailer';
import { resolve } from 'path';
import hbs from 'nodemailer-express-handlebars';
import exphbs from 'express-handlebars';
import mailConfig from '../config/mail';

class Mail {
    constructor() {
        const { host, port, secure, auth } = mailConfig;

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null,
        });

        this.configureTemplate();
    }

    configureTemplate() {
        const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

        this.transporter.user(
            'compile',
            hbs({
                viewEngine: exphbs.create({
                    layoutsDir: resolve(viewPath, 'layouts'),
                    partialsDir: resolve(viewPath, 'partials'),
                    defaultLayout: 'default',
                    extname: '.hbs',
                }),
                viewPath,
                extname: '.hbs',
            })
        );
    }

    sendMail(message) {
        return this.transporter.sendMail({ ...mailConfig.default, ...message });
    }
}

export default new Mail();
