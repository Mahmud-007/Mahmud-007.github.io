import React from 'react';

const Contact = () => {
    return (
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto">
                <p className="text-teal font-mono mb-4">What's Next?</p>
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-lightest mb-6">Get In Touch</h2>
                <p className="text-slate-light text-lg mb-12 leading-relaxed">
                    I’m based in Bangladesh and appreciate meaningful conversations around engineering, systems, and strategy. If my experience beyond typical SDE work resonates with you, I’m always open to a dialogue.        </p>
                <a
                    href="mailto:mahmud6799@gmail.com"
                    className="inline-block px-8 py-4 border-2 border-teal text-teal rounded hover:bg-teal/10 transition-colors duration-300 font-mono text-sm"
                >
                    Say Hello
                </a>

                <div className="mt-12 flex flex-col items-center">
                    <div className="flex space-x-6 mb-6">
                        <a href="https://github.com/Mahmud-007" target="_blank" rel="noreferrer" className="text-slate-light hover:text-teal transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        </a>
                        <a href="https://www.linkedin.com/in/rahman-mahmud/" target="_blank" rel="noreferrer" className="text-slate-light hover:text-teal transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                        </a>
                        <a href="https://x.com/Rahman007Mahmud" target="_blank" rel="noreferrer" className="text-slate-light hover:text-teal transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                        </a>
                        <a href="https://www.facebook.com/mahmudur.rahman6799" target="_blank" rel="noreferrer" className="text-slate-light hover:text-teal transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </a>
                        <a href="https://www.instagram.com/__mahmud_007__/" target="_blank" rel="noreferrer" className="text-slate-light hover:text-teal transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                    </div>
                    <div className="text-slate-light text-sm font-mono space-y-2">
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            <span>mahmud6799@gmail.com</span>
                        </div>
                        {/* Placeholder for phone since I don't have it, verify if user meant to add specific number or just 'phone' */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
