import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const { t } = useTranslation('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // WhatsApp configuration - change this to your number first, then to the final number
  const whatsappNumber = '+31623735563'; // Your WhatsApp number
  const whatsappMessage = 'Hello! I have a question about Jozef Supermarkt.';

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would send this to your backend
    console.log('Contact form submitted:', formData);
    
    setSubmitStatus('success');
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  const handleWhatsAppClick = () => {
    const formattedNumber = whatsappNumber.replace(/\s+/g, '').replace(/[()]/g, '');
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    
    // Try to open in WhatsApp app first, fallback to web
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // Mobile device - try to open WhatsApp app
      window.location.href = whatsappUrl;
    } else {
      // Desktop - open in new tab
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">{t('getInTouch')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Address Section */}
              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <MapPin className="h-8 w-8 text-lion-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('address.title')}</h3>
                  <div className="space-y-1 text-gray-700">
                    <p className="font-medium">{t('address.street')}</p>
                    <p>{t('address.city')}</p>
                    <p className="text-sm text-gray-600">{t('address.postal')}</p>
                  </div>
                </div>
              </div>

              {/* Phone Section */}
              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Phone className="h-8 w-8 text-lion-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('phone.title')}</h3>
                  <div className="space-y-1 text-gray-700">
                    <p className="font-medium text-lg">{t('phone.number')}</p>
                    <p className="text-sm text-gray-600">{t('phone.hours')}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Section */}
              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <MessageCircle className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('whatsapp.title')}</h3>
                  <p className="text-gray-700 mb-3">{t('whatsapp.message')}</p>
                  <button
                    onClick={handleWhatsAppClick}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center transition-colors"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {t('whatsapp.button')}
                  </button>
                </div>
              </div>

              {/* Email Section */}
              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Mail className="h-8 w-8 text-lion-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('email.title')}</h3>
                  <p className="text-gray-700 font-medium text-lg">{t('email.info')}</p>
                </div>
              </div>

              {/* Opening Hours Section */}
              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-lg md:col-span-2">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-lion-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('openingHours.title')}</h3>
                  <p className="text-gray-700 font-medium text-lg">{t('openingHours.weekdays')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 