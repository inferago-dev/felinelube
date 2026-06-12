import { motion } from 'framer-motion'
import { HiMail, HiPhone, HiLocationMarker, HiClock } from 'react-icons/hi'
import { useLanguage } from '../context/LanguageContext'
import '../styles/Contact.css'

export default function Contact() {
  const { t, lang } = useLanguage()

  const contactInfo = [
    {
      icon: <HiLocationMarker />,
      title: lang === 'en' ? 'Our Headquarters' : 'Ibu Pejabat Kami',
      detail: 'No. 5, Jalan Injap 34/4, Section 34, Alpine Industrial Park, 40470 Shah Alam, Selangor, Malaysia',
    },
    {
      icon: <HiPhone />,
      title: lang === 'en' ? 'Call Support' : 'Sokongan Telefon',
      detail: '+60 12-331 5585',
    },
    {
      icon: <HiMail />,
      title: lang === 'en' ? 'Email Inquiries' : 'Pertanyaan Emel',
      detail: 'info@felinelube.com.my',
    },
    {
      icon: <HiClock />,
      title: lang === 'en' ? 'Operating Hours' : 'Waktu Operasi',
      detail: lang === 'en' ? 'Mon - Fri: 9:00 AM - 6:00 PM' : 'Isnin - Jumaat: 9:00 AM - 6:00 PM',
    }
  ]

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="section-label">{lang === 'en' ? 'Connect' : 'Hubungi'}</div>
        <h2 className="section-title">{lang === 'en' ? 'Visit Our' : 'Lawati'} <span className="gold-text">HQ</span></h2>
        
        <div className="contact__layout">
          {/* Contact Details */}
          <div className="contact__info">
            <div className="contact__grid">
              {contactInfo.map((info, i) => (
                <motion.div 
                  key={info.title}
                  className="contact__card"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="contact__icon">{info.icon}</div>
                  <div className="contact__details">
                    <div className="contact__card-title">{info.title}</div>
                    <div className="contact__card-value">{info.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Map Embed */}
          <motion.div 
            className="contact__map-wrap"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3984.3307155450466!2d101.50309753417969!3d3.0053999423980713!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cdad0d2dda6adf%3A0xf28e56f8ec16f19d!2sFELINE%20GENUINE%20LUBRICANTS%20(M)%20SDN%20BHD!5e0!3m2!1sen!2sin!4v1778930857854!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Feline Genuine Lubricants HQ"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
