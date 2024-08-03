import express from 'express';
import rateLimit from 'express-rate-limit';
import * as nodemailer from 'nodemailer';
import { contactMail } from './email/contact';
import { preferCacheEntries } from './helpers/nodeCache.helper';
import { fetchHygraphData } from './helpers/fetchHygraphData.helper';
import { localizationQuery } from './querys/localization.query';
import { Localizations } from '../core/interfaces/cms.interfaces';
import dotenv from 'dotenv';

const contactRouter = express.Router();

dotenv.config();

// Überprüfen, ob alle erforderlichen Umgebungsvariablen vorhanden sind
const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`Fehlende Umgebungsvariable: ${varName}`);
        process.exit(1);
    }
});

// Ratenbegrenzung konfigurieren
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minuten
    max: 2, // maximal 2 Anfragen pro IP innerhalb von 15 Minuten
    message: "Zu viele Anfragen von dieser IP, bitte versuchen Sie es später noch einmal.",
});

contactRouter.use(limiter);

contactRouter.post('*', async (req, res) => {
    try {
        const { email, subject, message } = req.body;

        if (!email || !subject || !message) {
            return res.status(400).json({ error: 'Alle Felder sind erforderlich.' });
        }

        const transporter = nodemailer.createTransport({
            host: process.env['EMAIL_HOST'],
            port: 465,
            secure: true, // true für 465, false für andere Ports
            auth: {
                user: process.env['EMAIL_USER'],
                pass: process.env['EMAIL_PASS'],
            },
        });

        const cache = req.app.get('cache');
        const loc = req.headers['locales'] || 'de';
        const locales = loc === 'de' ? ["de", "en"] : ["en", "de"];
        const variables = { locales: locales };

        const locs = await preferCacheEntries<Localizations>(cache, `${loc}_localization`, async () => {
            const response = await fetchHygraphData<Array<{ key: string, value: string }>>(localizationQuery, variables);

            const localizations: Localizations = {};

            if (response.data['localizations']) {
                response.data['localizations'].forEach(local => localizations[local.key] = local.value);
            }

            return localizations;
        });

        if (!locs) {
            return res.status(500).json({ error: 'Could not fetch localization data.' });
        }

        let mail = contactMail;
        mail = mail.replace('{{mail.greatings}}', locs['mail.greatings']);
        mail = mail.replace('{{mail.content}}', locs['mail.content']);
        mail = mail.replace('{{subject}}', subject);
        mail = mail.replace('{{message}}', message);
        mail = mail.replace('{{mail.endText}}', locs['mail.endText']);
        mail = mail.replace('{{mail.postHeadline}}', '');
        mail = mail.replace('{{posts}}', '');

        const clientMailOptions = {
            from: process.env['EMAIL_USER'],
            to: email,
            subject: subject,
            html: mail,
        };

        const adminMailOptions = {
            from: process.env['EMAIL_USER'],
            to: process.env['EMAIL_USER'],
            subject: subject,
            replyTo: email,
            html: mail,
        };

        // E-Mail an den Client senden
        await transporter.sendMail(clientMailOptions);

        // E-Mail an den Administrator senden
        await transporter.sendMail(adminMailOptions);

        return res.status(200).json({ message: 'Nachrichten wurden erfolgreich gesendet.' });
    } catch (error) {
        console.error('Fehler beim Senden der E-Mails:', error);
        return res.status(500).json({ error: 'Fehler beim Senden der E-Mails.' });
    }
});

export default contactRouter;
