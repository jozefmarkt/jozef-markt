import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, Search, ShoppingCart, Truck, Package, User, CreditCard, RotateCcw, MessageCircle, Settings, HelpCircle } from 'lucide-react';

const HelpPage: React.FC = () => {
  const { t, i18n } = useTranslation('help');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());



  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const helpSections = [
    {
      id: 'shopping',
      icon: ShoppingCart,
      title: t('sections.shopping.title'),
      items: [
        { question: t('sections.shopping.q1'), answer: t('sections.shopping.a1') },
        { question: t('sections.shopping.q2'), answer: t('sections.shopping.a2') },
        { question: t('sections.shopping.q3'), answer: t('sections.shopping.a3') },
        { question: t('sections.shopping.q4'), answer: t('sections.shopping.a4') },
        { question: t('sections.shopping.q5'), answer: t('sections.shopping.a5') }
      ]
    },
    {
      id: 'delivery',
      icon: Truck,
      title: t('sections.delivery.title'),
      items: [
        { question: t('sections.delivery.q1'), answer: t('sections.delivery.a1') },
        { question: t('sections.delivery.q2'), answer: t('sections.delivery.a2') },
        { question: t('sections.delivery.q3'), answer: t('sections.delivery.a3') },
        { question: t('sections.delivery.q4'), answer: t('sections.delivery.a4') },
        { question: t('sections.delivery.q5'), answer: t('sections.delivery.a5') },
        { question: t('sections.delivery.q6'), answer: t('sections.delivery.a6') },
        { question: t('sections.delivery.q7'), answer: t('sections.delivery.a7') },
        { question: t('sections.delivery.q8'), answer: t('sections.delivery.a8') },
        { question: t('sections.delivery.q9'), answer: t('sections.delivery.a9') },
        { question: t('sections.delivery.q10'), answer: t('sections.delivery.a10') },
        { question: t('sections.delivery.q11'), answer: t('sections.delivery.a11') },
        { question: t('sections.delivery.q12'), answer: t('sections.delivery.a12') },
        { question: t('sections.delivery.q13'), answer: t('sections.delivery.a13') },
        { question: t('sections.delivery.q14'), answer: t('sections.delivery.a14') },
        { question: t('sections.delivery.q15'), answer: t('sections.delivery.a15') }
      ]
    },
    {
      id: 'products',
      icon: Package,
      title: t('sections.products.title'),
      items: [
        { question: t('sections.products.q1'), answer: t('sections.products.a1') },
        { question: t('sections.products.q2'), answer: t('sections.products.a2') },
        { question: t('sections.products.q3'), answer: t('sections.products.a3') },
        { question: t('sections.products.q4'), answer: t('sections.products.a4') },
        { question: t('sections.products.q5'), answer: t('sections.products.a5') }
      ]
    },
    {
      id: 'account',
      icon: User,
      title: t('sections.account.title'),
      items: [
        { question: t('sections.account.q1'), answer: t('sections.account.a1') },
        { question: t('sections.account.q2'), answer: t('sections.account.a2') },
        { question: t('sections.account.q3'), answer: t('sections.account.a3') },
        { question: t('sections.account.q4'), answer: t('sections.account.a4') }
      ]
    },
    {
      id: 'returns',
      icon: RotateCcw,
      title: t('sections.returns.title'),
      items: [
        { question: t('sections.returns.q1'), answer: t('sections.returns.a1') },
        { question: t('sections.returns.q2'), answer: t('sections.returns.a2') },
        { question: t('sections.returns.q3'), answer: t('sections.returns.a3') },
        { question: t('sections.returns.q4'), answer: t('sections.returns.a4') }
      ]
    },
    {
      id: 'payment',
      icon: CreditCard,
      title: t('sections.payment.title'),
      items: [
        { question: t('sections.payment.q1'), answer: t('sections.payment.a1') },
        { question: t('sections.payment.q2'), answer: t('sections.payment.a2') },
        { question: t('sections.payment.q3'), answer: t('sections.payment.a3') },
        { question: t('sections.payment.q4'), answer: t('sections.payment.a4') }
      ]
    },
    {
      id: 'support',
      icon: MessageCircle,
      title: t('sections.support.title'),
      items: [
        { question: t('sections.support.q1'), answer: t('sections.support.a1') },
        { question: t('sections.support.q2'), answer: t('sections.support.a2') },
        { question: t('sections.support.q3'), answer: t('sections.support.a3') },
        { question: t('sections.support.q4'), answer: t('sections.support.a4') }
      ]
    },
    {
      id: 'technical',
      icon: Settings,
      title: t('sections.technical.title'),
      items: [
        { question: t('sections.technical.q1'), answer: t('sections.technical.a1') },
        { question: t('sections.technical.q2'), answer: t('sections.technical.a2') },
        { question: t('sections.technical.q3'), answer: t('sections.technical.a3') },
        { question: t('sections.technical.q4'), answer: t('sections.technical.a4') }
      ]
    }
  ];

  const filteredSections = helpSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.items.some(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-12 w-12 text-lion-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">{t('title')}</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lion-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Quick Contact */}
        <div className="bg-lion-500 text-white rounded-lg p-6 mb-12 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">{t('quickContact.title')}</h3>
              <p className="text-lion-100">{t('quickContact.description')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/contact"
                className="bg-white text-lion-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 text-center"
              >
                {t('quickContact.contactUs')}
              </a>
              <a
                href="https://wa.me/31623735563"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 text-center"
              >
                {t('quickContact.whatsapp')}
              </a>
            </div>
          </div>
        </div>

        {/* Help Sections */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredSections.map((section) => {
            const IconComponent = section.icon;
            const isExpanded = expandedSections.has(section.id);
            
            return (
              <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <IconComponent className="h-6 w-6 text-lion-500 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="border-t border-gray-200">
                    <div className="p-6 space-y-6">
                      {section.items.map((item, index) => (
                        <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                          <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
                          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {searchQuery && filteredSections.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('noResults.title')}</h3>
            <p className="text-gray-600 mb-6">{t('noResults.description')}</p>
            <button
              onClick={() => setSearchQuery('')}
              className="bg-lion-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-lion-600 transition-colors duration-200"
            >
              {t('noResults.clearSearch')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpPage;
