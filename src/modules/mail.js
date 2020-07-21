import sgMail, { setTwilioEmailAuth } from '@sendgrid/mail';
import {SENDGRID_API_KEY,PROVIDER_EMAIL} from '../config/mail.json'
import handleBars from 'express-handlebars';
import path from 'path';

const hbs = handleBars.create({
    partialsDir : undefined,
    extname : 'html',
    layoutsDir : path.resolve(__dirname,'..','models','email')
});

// iniciando provedor de email e autenticando


sgMail.setApiKey(SENDGRID_API_KEY);


const defaultOptions = {
    to : "",
    subject : "",
    templateDir : "",
    context : {},
}


async function  sendEmail(options = defaultOptions){
    const {to,templateDir,context,subject} = options
    try {
        if(!to|| to === ""){
            throw Error('to is required')
        }
        if(!templateDir || templateDir == ""){
            throw Error('templateDir is required')
        }
        if(!subject|| subject === ""){
            throw Error('subject is required')
        }
        const result = await sgMail.send(
            {
                from : PROVIDER_EMAIL,
                to,
                subject,
                html : await hbs.render(templateDir,context)
            }
        )

        return result;
    }

    catch(err){
        throw err
    }

}
export default sendEmail;


