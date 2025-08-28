import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  Package, 
  Tag, 
  Folder, 
  LogOut, 
  User,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  showBackButton = false,
  backTo = '/admin'
}) => {
  const { t, i18n } = useTranslation('admin');
  const { user, logout } = useAuth();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Mobile-specific styles
  const mobileStyles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      direction: isRTL ? 'rtl' : 'ltr' as any,
      width: '100%',
      maxWidth: '100vw',
      overflow: 'hidden'
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      width: '100%'
    },
    headerContent: {
      maxWidth: '100%',
      padding: '1rem',
      overflow: 'hidden'
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      flexDirection: isRTL ? 'row-reverse' : 'row' as any,
      width: '100%',
      marginBottom: '1rem'
    },
    titleText: {
      flex: 1,
      minWidth: 0,
      wordBreak: 'break-word' as any,
      overflowWrap: 'break-word' as any
    },
    controlsSection: {
      display: 'flex',
      flexDirection: 'column' as any,
      gap: '0.5rem',
      width: '100%'
    },
    controlRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      flexDirection: isRTL ? 'row-reverse' : 'row' as any,
      flexWrap: 'wrap' as any
    },
    navigation: {
      display: 'flex',
      flexDirection: 'column' as any,
      gap: '0.5rem',
      borderTop: '1px solid #e5e7eb',
      paddingTop: '1rem',
      width: '100%'
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      textDecoration: 'none',
      flexDirection: isRTL ? 'row-reverse' : 'row' as any,
      whiteSpace: 'normal' as any,
      wordBreak: 'break-word' as any,
      width: '100%'
    },
    mainContent: {
      maxWidth: '100%',
      padding: '1rem',
      overflow: 'hidden'
    }
  };

  return (
    <div style={mobileStyles.container}>
      {/* Header */}
      <header style={mobileStyles.header}>
        <div style={mobileStyles.headerContent}>
          {/* Title Section */}
          <div style={mobileStyles.titleSection}>
            {showBackButton && (
              <Link
                to={backTo}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#6b7280',
                  textDecoration: 'none',
                  flexShrink: 0
                }}
              >
                <ArrowLeft style={{ height: '1.25rem', width: '1.25rem' }} />
              </Link>
            )}
            <div style={mobileStyles.titleText}>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827',
                margin: 0,
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}>{title}</h1>
              {subtitle && (
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: '0.25rem 0 0 0',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}>{subtitle}</p>
              )}
            </div>
          </div>

          {/* Controls Section */}
          <div style={mobileStyles.controlsSection}>
            <div style={mobileStyles.controlRow}>
              {/* User Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#6b7280',
                flexDirection: isRTL ? 'row-reverse' : 'row'
              }}>
                <User style={{ height: '1rem', width: '1rem', flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.username}</span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#dc2626',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  flexDirection: isRTL ? 'row-reverse' : 'row'
                }}
              >
                <LogOut style={{ height: '1rem', width: '1rem' }} />
                <span>Logout</span>
              </button>
              
              {/* Language Switcher */}
              <div style={{ position: 'relative' }}>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav style={mobileStyles.navigation}>
            <Link
              to="/admin"
              style={{
                ...mobileStyles.navItem,
                color: isActive('/admin') ? '#4f46e5' : '#6b7280',
                borderBottom: isActive('/admin') ? '2px solid #4f46e5' : 'none'
              }}
            >
              <Home style={{ height: '1rem', width: '1rem', flexShrink: 0 }} />
              <span>{t('dashboard.title')}</span>
            </Link>
            <Link
              to="/admin/products"
              style={{
                ...mobileStyles.navItem,
                color: isActive('/admin/products') ? '#4f46e5' : '#6b7280',
                borderBottom: isActive('/admin/products') ? '2px solid #4f46e5' : 'none'
              }}
            >
              <Package style={{ height: '1rem', width: '1rem', flexShrink: 0 }} />
              <span>{t('products.title')}</span>
            </Link>
            <Link
              to="/admin/offers"
              style={{
                ...mobileStyles.navItem,
                color: isActive('/admin/offers') ? '#4f46e5' : '#6b7280',
                borderBottom: isActive('/admin/offers') ? '2px solid #4f46e5' : 'none'
              }}
            >
              <Tag style={{ height: '1rem', width: '1rem', flexShrink: 0 }} />
              <span>{t('offers.title')}</span>
            </Link>
            <Link
              to="/admin/categories"
              style={{
                ...mobileStyles.navItem,
                color: isActive('/admin/categories') ? '#4f46e5' : '#6b7280',
                borderBottom: isActive('/admin/categories') ? '2px solid #4f46e5' : 'none'
              }}
            >
              <Folder style={{ height: '1rem', width: '1rem', flexShrink: 0 }} />
              <span>{t('categories.title')}</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={mobileStyles.mainContent}>
        <div style={{ padding: '1rem 0' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
