import { useTranslation } from 'react-i18next';
import { Truck, Clock, MapPin, CreditCard, Phone, Mail, MessageCircle } from 'lucide-react';

const ShippingPage: React.FC = () => {
  const { t } = useTranslation('help');

  const deliveryInfo = [
    {
      icon: MapPin,
      title: t('sections.delivery.q1'),
      content: t('sections.delivery.a1'),
      color: 'text-blue-600'
    },
    {
      icon: CreditCard,
      title: t('sections.delivery.q2'),
      content: t('sections.delivery.a2'),
      color: 'text-green-600'
    },
    {
      icon: Clock,
      title: t('sections.delivery.q7'),
      content: t('sections.delivery.a7'),
      color: 'text-orange-600'
    },
    {
      icon: Truck,
      title: t('sections.delivery.q8'),
      content: t('sections.delivery.a8'),
      color: 'text-purple-600'
    }
  ];

  const additionalInfo = [
    {
      question: t('sections.delivery.q3'),
      answer: t('sections.delivery.a3')
    },
    {
      question: t('sections.delivery.q4'),
      answer: t('sections.delivery.a4')
    },
    {
      question: t('sections.delivery.q5'),
      answer: t('sections.delivery.a5')
    },
    {
      question: t('sections.delivery.q6'),
      answer: t('sections.delivery.a6')
    },
    {
      question: t('sections.delivery.q9'),
      answer: t('sections.delivery.a9')
    },
    {
      question: t('sections.delivery.q10'),
      answer: t('sections.delivery.a10')
    },
    {
      question: t('sections.delivery.q11'),
      answer: t('sections.delivery.a11')
    },
    {
      question: t('sections.delivery.q12'),
      answer: t('sections.delivery.a12')
    },
    {
      question: t('sections.delivery.q13'),
      answer: t('sections.delivery.a13')
    },
    {
      question: t('sections.delivery.q14'),
      answer: t('sections.delivery.a14')
    },
    {
      question: t('sections.delivery.q15'),
      answer: t('sections.delivery.a15')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Truck className="h-12 w-12 text-lion-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              {t('sections.delivery.title')}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('shipping.subtitle')}
          </p>
        </div>

        {/* Key Information Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {deliveryInfo.map((info, index) => {
            const IconComponent = info.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <IconComponent className={`h-8 w-8 ${info.color} mr-3`} />
                  <h3 className="text-lg font-semibold text-gray-900">{info.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{info.content}</p>
              </div>
            );
          })}
        </div>

        {/* Contact Information */}
        <div className="bg-lion-500 text-white rounded-lg p-8 mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">{t('shipping.contactTitle')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Phone className="h-8 w-8 mx-auto mb-3" />
                             <h3 className="font-semibold mb-2">{t('shipping.phone')}</h3>
              <p>‎+31 6 23735563‎</p>
            </div>
            <div className="text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-3" />
                             <h3 className="font-semibold mb-2">{t('shipping.whatsapp')}</h3>
               <p>{t('shipping.directContact')}</p>
            </div>
            <div className="text-center">
              <Mail className="h-8 w-8 mx-auto mb-3" />
                             <h3 className="font-semibold mb-2">{t('shipping.email')}</h3>
              <p>jozefmarkt@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('shipping.faqTitle')}
          </h2>
          <div className="space-y-6">
            {additionalInfo.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/help"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
            >
              {t('actions.viewAllHelp')}
            </a>
            <a
              href="/contact"
              className="bg-lion-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-lion-600 transition-colors duration-200"
            >
              {t('actions.contactUs')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
