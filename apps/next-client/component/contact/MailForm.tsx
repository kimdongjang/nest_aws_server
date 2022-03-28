import React, { DetailedHTMLProps, FormEventHandler, FormHTMLAttributes, useEffect, useRef, useState } from "react";
import emailjs, {init} from '@emailjs/browser';
import './mailForm.module.css'

type Props = {};

type EmailData = {
    name: string;
    subject: string;
    message: string;
}

export default function MailForm(props: any) {
    useEffect(()=>{init("0Cv9lbuoYp-3kSV-d")},[])

    const [name, setName] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const form = useRef<HTMLFormElement>(null);

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data: EmailData = {name: name, subject:subject, message:message}

        emailjs.sendForm('gieun_test_mail', 'template_vlicnna', e.target as HTMLFormElement, '0Cv9lbuoYp-3kSV-d').
            then((result) => {
                console.log(result.text);
            },(error)=>{
                console.log(error.text);
            });
    }

    return <div><form className="contact__form" onSubmit={sendEmail} >
        <p>Your Name:</p>
        <input name='name' type='text' placeholder="name" className="form__input" />
        <p>Subject:</p>
        <input name='subject' type='text'  placeholder="subject" className="form__input" />
        <p>Your Message:</p>
        <textarea name='message'   placeholder='Your Message…' className='form__input-message' ></textarea>
        <button className='form__input__button'>Send Message</button>
    </form ></div >
}
