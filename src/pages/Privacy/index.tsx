import { useTranslation } from 'react-i18next';
import { Shield, Eye, Lock, Users, Database, Globe, Mail, Phone, Calendar } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const { t } = useTranslation('privacy');

  const privacySections = [
    {
      id: 'overview',
      icon: Shield,
      title: t('sections.overview.title'),
      content: t('sections.overview.content')
    },
    {
      id: 'collection',
      icon: Database,
      title: t('sections.collection.title'),
      content: t('sections.collection.content')
    },
    {
      id: 'usage',
      icon: Eye,
      title: t('sections.usage.title'),
      content: t('sections.usage.content')
    },
    {
      id: 'sharing',
      icon: Users,
      title: t('sections.sharing.title'),
      content: t('sections.sharing.content')
    },
    {
      id: 'security',
      icon: Lock,
      title: t('sections.security.title'),
      content: t('sections.security.content')
    },
    {
      id: 'cookies',
      icon: Globe,
      title: t('sections.cookies.title'),
      content: t('sections.cookies.content')
    },
    {
      id: 'rights',
      icon: Shield,
      title: t('sections.rights.title'),
      content: t('sections.rights.content')
    },
    {
      id: 'children',
      icon: Users,
      title: t('sections.children.title'),
      content: t('sections.children.content')
    },
    {
      id: 'changes',
      icon: Calendar,
      title: t('sections.changes.title'),
      content: t('sections.changes.content')
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
            <Shield className="h-12 w-12 text-lion-500 mr-3" />
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
              <h3 className="font-semibold mb-2">{t('summary.whatWeCollect')}</h3>
              <ul className="space-y-1 text-lion-100">
                <li>• {t('summary.collect1')}</li>
                <li>• {t('summary.collect2')}</li>
                <li>• {t('summary.collect3')}</li>
                <li>• {t('summary.collect4')}</li>
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

        {/* Privacy Policy Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {privacySections.map((section) => {
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

export default PrivacyPage;
