import React, { useState, useEffect, useCallback } from 'react';
import { ToastProvider, useToast } from './components/common/Toast';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { DesktopNav } from './components/layout/DesktopNav';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Views
import { HomeView } from './views/HomeView';
import { PulsaView } from './views/PulsaView';
import { KuotaView } from './views/KuotaView';
import { PlnView } from './views/PlnView';
import { GameView } from './views/GameView';
import { SendGiftView } from './views/SendGiftView';
import { AllProductsView } from './views/AllProductsView';
import { HistoryView } from './views/HistoryView';
import { FavoritesView } from './views/FavoritesView';
import { HelpView } from './views/HelpView';
import { SettingsView } from './views/SettingsView';

// Checkout & Transaction Modals
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { PaymentProcessingModal } from './components/checkout/PaymentProcessingModal';
import { TransactionSuccessModal } from './components/checkout/TransactionSuccessModal';
import { TransactionFailedModal } from './components/checkout/TransactionFailedModal';

// Types & Services
import { 
  AppActiveTab, 
  ProductCategory, 
  Product, 
  ProviderId, 
  PaymentMethodId, 
  Transaction 
} from './types';
import { 
  getStoredNotifications, 
  getRecentTargets, 
  RecentTarget 
} from './services/storage';
import { PaymentService } from './services/paymentService';

function MainApp() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<AppActiveTab>('home');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null);
  const [isGiftViewOpen, setIsGiftViewOpen] = useState(false);
  const [giftInitialType, setGiftInitialType] = useState<'data' | 'pulsa'>('data');
  const [targetProvider, setTargetProvider] = useState<ProviderId | undefined>(undefined);
  const [targetDestination, setTargetDestination] = useState<string>('');
  const [targetSecondary, setTargetSecondary] = useState<string | undefined>(undefined);

  // Search Modal
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Checkout & Payment State
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutDestination, setCheckoutDestination] = useState<string>('');
  const [checkoutSecondary, setCheckoutSecondary] = useState<string | undefined>(undefined);
  const [checkoutCustomerName, setCheckoutCustomerName] = useState<string | undefined>(undefined);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Payment Execution Lifecycle
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const [paymentStage, setPaymentStage] = useState<'idle' | 'waiting_payment' | 'verifying' | 'fulfilling' | 'complete'>('idle');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);

  // Notifications & Recent
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentTargets, setRecentTargets] = useState<RecentTarget[]>([]);

  const { showToast } = useToast();

  const refreshAppData = useCallback(() => {
    const notifs = getStoredNotifications();
    setUnreadCount(notifs.filter(n => !n.isRead).length);
    setRecentTargets(getRecentTargets());
  }, []);

  useEffect(() => {
    refreshAppData();
    const handleStorageUpdate = () => refreshAppData();
    window.addEventListener('pulsaku_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('pulsaku_storage_update', handleStorageUpdate);
  }, [refreshAppData]);

  // Handle category shortcut selection
  const handleSelectCategory = (category: ProductCategory, provider?: ProviderId) => {
    setIsGiftViewOpen(false);
    setActiveCategory(category);
    setTargetProvider(provider);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle opening Send to Loved Ones view
  const handleOpenSendGift = (type: 'data' | 'pulsa') => {
    setActiveCategory(null);
    setGiftInitialType(type);
    setIsGiftViewOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle direct product selection (from search, popular deals, or quick lists)
  const handleOpenCheckoutForProduct = (
    product: Product, 
    destination: string = '', 
    secondary?: string,
    customerName?: string
  ) => {
    setCheckoutProduct(product);
    setCheckoutDestination(destination || targetDestination || '081234567890');
    setCheckoutSecondary(secondary || targetSecondary);
    setCheckoutCustomerName(customerName);
    setIsCheckoutOpen(true);
  };

  // Handle re-buying from Recent Targets
  const handleSelectRecentTarget = (target: RecentTarget) => {
    const cat = target.category as ProductCategory;
    setActiveCategory(cat);
    setTargetProvider(target.provider as ProviderId);
    setTargetDestination(target.targetValue);
    setTargetSecondary(target.secondaryValue);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle 1-tap direct buy from Favorites
  const handleDirectBuyFavorite = (
    category: ProductCategory, 
    provider: ProviderId, 
    targetValue: string, 
    secondaryValue?: string
  ) => {
    setActiveCategory(category);
    setTargetProvider(provider);
    setTargetDestination(targetValue);
    setTargetSecondary(secondaryValue);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start Payment Creation
  const handleConfirmCheckout = (methodId: PaymentMethodId, methodTitle: string) => {
    if (!checkoutProduct) return;

    // Create transaction in storage
    const tx = PaymentService.createTransaction({
      product: checkoutProduct,
      destination: checkoutDestination,
      secondaryDestination: checkoutSecondary,
      customerName: checkoutCustomerName,
      paymentMethod: methodId,
      paymentMethodName: methodTitle
    });

    setActiveTransaction(tx);
    setIsCheckoutOpen(false);
    setPaymentStage('waiting_payment');
  };

  // Simulate Payment Success
  const handleSimulatePayment = async () => {
    if (!activeTransaction) return;

    try {
      const result = await PaymentService.processPayment(
        activeTransaction.transactionId,
        (stage) => {
          setPaymentStage(stage);
        }
      );

      setActiveTransaction(result);
      setPaymentStage('idle');

      if (result.status === 'SUCCESS') {
        setShowSuccessModal(true);
      } else {
        setShowFailedModal(true);
      }
    } catch (e) {
      setPaymentStage('idle');
      showToast('Gagal memproses pembayaran', 'error');
    }
  };

  // Render active main content
  const renderContent = () => {
    // If Send Gift view is open
    if (isGiftViewOpen) {
      return (
        <SendGiftView
          onBack={() => setIsGiftViewOpen(false)}
          initialType={giftInitialType}
          onSelectProduct={(prod, phone, note) => {
            setIsGiftViewOpen(false);
            handleOpenCheckoutForProduct(prod, phone, undefined, note);
          }}
        />
      );
    }

    // If a specific sub-category view is open (e.g. Semua Pulsa, Semua Kuota, PLN, Game)
    if (activeCategory === 'pulsa') {
      return (
        <PulsaView
          onBack={() => setActiveCategory(null)}
          onSelectProduct={(prod, phone) => handleOpenCheckoutForProduct(prod, phone)}
          initialPhone={targetDestination}
          initialProvider={targetProvider || 'telkomsel'}
        />
      );
    }

    if (activeCategory === 'kuota') {
      return (
        <KuotaView
          onBack={() => setActiveCategory(null)}
          onSelectProduct={(prod, phone) => handleOpenCheckoutForProduct(prod, phone)}
          initialPhone={targetDestination}
          initialProvider={targetProvider || 'telkomsel'}
        />
      );
    }

    if (activeCategory === 'pln') {
      return (
        <PlnView
          onBack={() => setActiveCategory(null)}
          onSelectProduct={(prod, meterNo, customerName) => 
            handleOpenCheckoutForProduct(prod, meterNo, undefined, customerName)
          }
          initialMeterNo={targetDestination}
        />
      );
    }

    if (activeCategory === 'game') {
      return (
        <GameView
          onBack={() => setActiveCategory(null)}
          onSelectProduct={(prod, userId, secondary) => 
            handleOpenCheckoutForProduct(prod, userId, secondary)
          }
          initialGame={targetProvider || 'mlbb'}
        />
      );
    }

    // Main Tab Views
    switch (activeTab) {
      case 'home':
        return (
          <HomeView
            onSelectCategory={handleSelectCategory}
            onNavigateTab={(tab) => {
              setIsGiftViewOpen(false);
              setActiveCategory(null);
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={(prod) => handleOpenCheckoutForProduct(prod)}
            onSendGift={handleOpenSendGift}
            recentTargets={recentTargets}
            onSelectRecentTarget={handleSelectRecentTarget}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        );
      case 'products':
        return (
          <AllProductsView
            onSelectCategory={handleSelectCategory}
            onSelectProduct={(prod) => handleOpenCheckoutForProduct(prod)}
          />
        );
      case 'history':
        return <HistoryView />;
      case 'favorites':
        return (
          <FavoritesView
            onDirectBuy={handleDirectBuyFavorite}
          />
        );
      case 'help':
        return <HelpView />;
      case 'settings':
        return (
          <SettingsView
            onSelectCategory={(cat) => {
              setIsGiftViewOpen(false);
              setActiveCategory(cat);
              setActiveTab('home');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row text-neutral-900 font-sans">
      {/* Desktop Sidebar Navigation */}
      <DesktopNav
        activeTab={activeCategory || isGiftViewOpen ? 'products' : activeTab}
        onNavigate={(tab) => {
          setIsGiftViewOpen(false);
          setActiveCategory(null);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unreadNotifsCount={unreadCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-8">
        {/* Sticky Mobile/Desktop Top Header */}
        <Header
          onNavigate={(tab) => {
            setIsGiftViewOpen(false);
            setActiveCategory(null);
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          activeTab={activeTab}
          unreadNotifsCount={unreadCount}
          onSelectProduct={(prod) => handleOpenCheckoutForProduct(prod)}
        />

        {/* Main View Container */}
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeCategory || isGiftViewOpen ? 'products' : activeTab}
        onNavigate={(tab) => {
          setIsGiftViewOpen(false);
          setActiveCategory(null);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unreadCount={unreadCount}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(prod) => {
          if (prod.category === 'pulsa') {
            setActiveCategory('pulsa');
            setTargetProvider(prod.provider);
          } else if (prod.category === 'kuota') {
            setActiveCategory('kuota');
            setTargetProvider(prod.provider);
          } else if (prod.category === 'pln') {
            setActiveCategory('pln');
          } else if (prod.category === 'game') {
            setActiveCategory('game');
            setTargetProvider(prod.provider);
          }
        }}
      />

      {/* Checkout Bottom Sheet / Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        product={checkoutProduct}
        destination={checkoutDestination}
        secondaryDestination={checkoutSecondary}
        customerName={checkoutCustomerName}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirmPayment={handleConfirmCheckout}
      />

      {/* Payment Processing Modal */}
      <PaymentProcessingModal
        transaction={activeTransaction}
        stage={paymentStage}
        onSimulatePay={handleSimulatePayment}
        onCancel={() => setPaymentStage('idle')}
      />

      {/* Transaction Success Modal */}
      <TransactionSuccessModal
        transaction={activeTransaction}
        onClose={() => setShowSuccessModal(false)}
        onGoHome={() => {
          setShowSuccessModal(false);
          setActiveCategory(null);
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onViewHistory={() => {
          setShowSuccessModal(false);
          setActiveCategory(null);
          setActiveTab('history');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Transaction Failed Modal */}
      <TransactionFailedModal
        transaction={activeTransaction}
        onRetry={() => {
          setShowFailedModal(false);
          setIsCheckoutOpen(true);
        }}
        onGoHome={() => {
          setShowFailedModal(false);
          setActiveCategory(null);
          setActiveTab('home');
        }}
        onHelp={() => {
          setShowFailedModal(false);
          setActiveCategory(null);
          setActiveTab('help');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
