import React, { FormEventHandler, useRef } from "react";
import emailjs from '@emailjs/browser';

type Props = {};

export default function MailForm(props: any) {
    const form = useRef<HTMLInputElement>(null);

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        emailjs.sendForm('service_id', 'template_id', form.current, 'user_id').
            then((result) => {
                console.log(result.text);
            })
    }

    return <div><form className="form" onSubmit={sendEmail} >
        <p>Your Name:</p>
        <input name='name' type='text' placeholder="name" className="form__input" />
        <p>Subject:</p>
        <input name='subject' type='text' placeholder="subject" className="form__input" />
        <p>Your Message:</p>
        <textarea name='message' placeholder='Your Message…' className='form__input-message' ></textarea>
        <button className='form__input__button'>Send Message</button>
    </form ></div >
}
