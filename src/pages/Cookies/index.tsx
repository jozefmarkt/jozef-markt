import { useTranslation } from 'react-i18next';
import { Cookie, Settings, Shield, Eye, Globe, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';

const CookiesPage: React.FC = () => {
  const { t } = useTranslation('cookies');

  const cookieSections = [
    {
      id: 'overview',
      icon: Cookie,
      title: t('sections.overview.title'),
      content: t('sections.overview.content')
    },
    {
      id: 'types',
      icon: Settings,
      title: t('sections.types.title'),
      content: t('sections.types.content')
    },
    {
      id: 'usage',
      icon: Eye,
      title: t('sections.usage.title'),
      content: t('sections.usage.content')
    },
    {
      id: 'management',
      icon: Settings,
      title: t('sections.management.title'),
      content: t('sections.management.content')
    },
    {
      id: 'thirdParty',
      icon: Globe,
      title: t('sections.thirdParty.title'),
      content: t('sections.thirdParty.content')
    },
    {
      id: 'choices',
      icon: CheckCircle,
      title: t('sections.choices.title'),
      content: t('sections.choices.content')
    },
    {
      id: 'security',
      icon: Shield,
      title: t('sections.security.title'),
      content: t('sections.security.content')
    },
    {
      id: 'updates',
      icon: Calendar,
      title: t('sections.updates.title'),
      content: t('sections.updates.content')
    },
    {
      id: 'contact',
      icon: Mail,
      title: t('sections.contact.title'),
      content: t('sections.contact.content')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Cookie className="h-12 w-12 text-lion-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">{t('title')}</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>{t('lastUpdated')}: {t('lastUpdatedDate')}</p>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-lion-500 text-white rounded-lg p-6 mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">{t('summary.title')}</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">{t('summary.whatAreCookies')}</h3>
              <ul className="space-y-1 text-lion-100">
                <li>• {t('summary.cookie1')}</li>
                <li>• {t('summary.cookie2')}</li>
                <li>• {t('summary.cookie3')}</li>
                <li>• {t('summary.cookie4')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">{t('summary.howWeUse')}</h3>
              <ul className="space-y-1 text-lion-100">
                <li>• {t('summary.use1')}</li>
                <li>• {t('summary.use2')}</li>
                <li>• {t('summary.use3')}</li>
                <li>• {t('summary.use4')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cookie Policy Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {cookieSections.map((section) => {
            const IconComponent = section.icon;
            
            return (
              <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex items-center mb-6">
                  <IconComponent className="h-8 w-8 text-lion-500 mr-4" />
                  <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>



        {/* Contact Information */}
        <div className="bg-gray-100 rounded-lg p-8 mt-12 max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('contactInfo.title')}</h2>
            <p className="text-gray-600 mb-6">{t('contactInfo.description')}</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center">
                <Mail className="h-5 w-5 text-lion-500 mr-2" />
                <a 
                  href="mailto:jozefmarkt@gmail.com" 
                  className="text-lion-500 hover:text-lion-600 font-medium"
                >
                  jozefmarkt@gmail.com
                </a>
              </div>
              <div className="flex items-center justify-center">
                <Phone className="h-5 w-5 text-lion-500 mr-2" />
                <a 
                  href="tel:+31623735563" 
                  className="text-lion-500 hover:text-lion-600 font-medium"
                >
                  ‎+31 6 23735563‎
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
