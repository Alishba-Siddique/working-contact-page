import React, { useState, useEffect } from 'react';
import {
  CiMail,
  CiLinkedin,
  CiTwitter,
} from 'react-icons/ci'; 
import { PiGithubLogoThin,  PiGlobeThin } from "react-icons/pi";// Assuming you have these icons imported
import gsap from 'gsap';

const ContactPage = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  
    const [message, setMessage] = useState({
      text: '',
      type: '', // 'success', 'warning', 'error', or 'info'
    });
  
    const [messageVisible, setMessageVisible] = useState(false); // Start as hidden
  
    const handleCloseMessage = () => {
      setMessageVisible(false); // Update state to hide the message
    };
    
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await fetch('http://localhost:3000/server/send-email.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        console.log('Response status:', response.status); // Log the response status
        const text = await response.text(); // Get the response as text
        console.log('Response text:', text); // Log the response text
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const data = JSON.parse(text); // Parse the text as JSON
    
        if (data.status === 'success') {
          setMessage({ text: data.message, type: 'success' });
          setMessageVisible(true);
          setFormData({ name: '', email: '', subject: '', message: '' });
        } else {
          setMessage({ text: data.message, type: 'error' });
          setMessageVisible(true);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
        setMessage({ text: 'An error occurred. Please try again later.', type: 'error' });
        setMessageVisible(true);
      }
    };
    
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    useEffect(() => {
      gsap.fromTo(
        '#contact-page',
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: '#contact-page',
            start: 'top 80%',
            end: 'bottom 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, []);
  
    return (
      <div className="relative overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          autoPlay
          loop
          muted // This shows a poster image before the video loads
        >
          <source src="https://videos.pexels.com/video-files/857134/857134-hd_1280_720_24fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
  
        <div className="absolute inset-0 top-0 left-0 w-full h-full object-cover -z-10 bg-black opacity-20"></div>

        <div
          id="contact-page"
          className="text-gray-100 font-[sans-serif] mt-5 py-10 sm:py-10 md:py-20 lg:py-20 xl:py-20 mediumLaptop:py-20 2xl:py-20 largestLaptop:py-20 px-6 sm:px-6 md:px-20 lg:px-36 xl:px-36 mediumLaptop:px-36 2xl:px-36 largestLaptop:px-36"
        >
          {/* Message Display */}
          {messageVisible && message.text && (
            <span className={`font-[sans-serif] space-y-8 flex items-center justify-center`}>
              <span
                className={`p-6 rounded-lg relative ${
                  message.type === 'success'
                    ? 'bg-white drop-shadow-lg text-black'
                    : message.type === 'warning'
                    ? 'bg-yellow-50 text-yellow-800'
                    : message.type === 'error'
                    ? 'bg-red-50 text-red-800'
                    : 'bg-blue-50 text-blue-800'
                }`}
                role="alert"
              >
                <span className="z-50 flex items-center justify-center">
                  <div onClick={handleCloseMessage}>
                    {/* Close the message */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 cursor-pointer fill-black absolute right-4 top-4"
                      viewBox="0 0 320.591 320.591"
                    >
                      <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" />
                      <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" />
                    </svg>
                  </div>
                  <strong className="font-bold text-sm mr-3">{`${
                    message.type.charAt(0).toUpperCase() + message.type.slice(1)
                  } Message!`}</strong>
                </span>
                <span className="block sm:inline text-sm">{message.text}</span>
              </span>
            </span>
          )}
  
          <div className="items-start p-8 mx-auto bg-white shadow-[0_2px_10px_-3px_rgba(0,0,0,0.3)] max-w-4xl mt-24 px-8 grid gap-14 grid-cols-1 md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 py-16 text-gray-900 rounded-md">
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-[#2929b] text-4xl lg:text-5xl font-bold leading-tight font-nudista">
                  Let's talk
                </h2>
                <p className="text-sm text-gray-500 mt-4 font-[sans-serif]">
                  Have some big idea or brand to develop and need help? Then reach
                  out we'd love to hear about your project and provide help.
                </p>
  
                <div className="mt-12">
                  <h2 className="text-gray-800 text-base font-bold font-nudista">
                    Email
                  </h2>
                  <ul className="mt-4">
                    <li className="flex items-center">
                      <div className="group bg-[#e6e6e6cf] hover:bg-[#293759] h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-black">
                        <a
                          href="mailto:alishbasiddique38@gmail.com"
                          className="group-hover:text-white"
                        >
                          <CiMail size={20} />
                        </a>
                      </div>
                      <a
                        href="mailto:alishbasiddique38@gmail.com"
                        className="text-[#293759] text-sm ml-4"
                      >
                        <small className="block font-nudista">Mail</small>
                        <strong className="font-[sans-serif]">
                        alishbasiddique38@gmail.com
                        </strong>
                      </a>
                    </li>
                  </ul>
                </div>
  
                <div className="mt-12">
                  <h2 className="text-gray-800 text-base font-bold font-nudista">
                    Follow
                  </h2>
                  <ul className=" flex mt-4 space-x-6">
                    <li>
                      <a
                        href="https://www.linkedin.com/in/alishba-siddique"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="  text-[#293759] hover:text-white "
                      >
                        <CiLinkedin size={40} className='bg-[#e6e6e6cf] hover:bg-[#293759] p-2 rounded-full  transition duration-300'/>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://github.com/Alishba-Siddique/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#293759] hover:text-white  "
                      >
                        <PiGithubLogoThin size={40} className='bg-[#e6e6e6cf] hover:bg-[#293759]  p-2 rounded-full  transition duration-300' />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://alishba-siddique.netlify.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#293759] hover:text-white   "
                      >
                        <PiGlobeThin size={40} className='bg-[#e6e6e6cf] hover:bg-[#293759] p-2 rounded-full  transition duration-300' />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
  
            <div className="flex flex-col">
              <form onSubmit={handleSubmit} className="flex flex-col">
                <label className="mb-1 text-sm font-nudista">Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="p-3 mb-5 border border-gray-300 rounded-md"
                />
                <label className="mb-1 text-sm font-nudista">Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="johndoe@gmail.com"
                  className="p-3 mb-5 border border-gray-300 rounded-md"
                />
                <label className="mb-1 text-sm font-nudista">Subject</label>
                <input
                  required
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Type your subject"
                  className="p-3 mb-5 border border-gray-300 rounded-md"
                />
                <label className="mb-1 text-sm font-nudista">Message</label>
                <textarea
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message"
                  className="p-3 mb-5 border border-gray-300 rounded-md"
                />
                <button
                  type="submit"
                  className="bg-[#293759]  text-white py-3 mt-2 rounded-md hover:bg-black transition duration-300 ease-in-out"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ContactPage;