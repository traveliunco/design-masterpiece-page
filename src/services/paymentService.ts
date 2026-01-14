/**
 * بوابة الدفع الوهمية
 * تحاكي Tabby و Tamara للتقسيط
 */

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'tabby' | 'tamara' | 'apple_pay' | 'stc_pay';
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  logo: string;
  enabled: boolean;
}

export interface InstallmentPlan {
  id: string;
  provider: 'tabby' | 'tamara';
  installments: number;
  amount: number;
  total: number;
  fee: number;
  currency: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  method: PaymentMethod['type'];
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
    holderName: string;
  };
  installmentPlan?: InstallmentPlan;
  bookingId: string;
  customerInfo: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  };
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  message: string;
  messageAr: string;
  receiptUrl?: string;
  paidAt?: string;
}

// طرق الدفع المتاحة
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'credit_card',
    type: 'credit_card',
    name: 'Credit/Debit Card',
    nameAr: 'بطاقة ائتمان / خصم',
    description: 'Pay with Visa, Mastercard, or Mada',
    descriptionAr: 'ادفع باستخدام فيزا، ماستركارد، أو مدى',
    logo: '/payment-icons/cards.png',
    enabled: true,
  },
  {
    id: 'tabby',
    type: 'tabby',
    name: 'Tabby',
    nameAr: 'تابي',
    description: 'Split in 4 payments, no interest',
    descriptionAr: 'قسّم على 4 دفعات بدون فوائد',
    logo: '/payment-icons/tabby.png',
    enabled: true,
  },
  {
    id: 'tamara',
    type: 'tamara',
    name: 'Tamara',
    nameAr: 'تمارا',
    description: 'Pay later in 3 installments',
    descriptionAr: 'ادفع لاحقاً على 3 أقساط',
    logo: '/payment-icons/tamara.png',
    enabled: true,
  },
  {
    id: 'apple_pay',
    type: 'apple_pay',
    name: 'Apple Pay',
    nameAr: 'أبل باي',
    description: 'Fast and secure payment',
    descriptionAr: 'دفع سريع وآمن',
    logo: '/payment-icons/apple-pay.png',
    enabled: true,
  },
  {
    id: 'stc_pay',
    type: 'stc_pay',
    name: 'STC Pay',
    nameAr: 'STC Pay',
    description: 'Pay with your STC Pay wallet',
    descriptionAr: 'ادفع من محفظة STC Pay',
    logo: '/payment-icons/stc-pay.png',
    enabled: true,
  },
];

/**
 * حساب خطط التقسيط
 */
export const calculateInstallmentPlans = (amount: number, currency: string = 'SAR'): InstallmentPlan[] => {
  const plans: InstallmentPlan[] = [];

  // Tabby - 4 أقساط بدون فوائد
  if (amount >= 100 && amount <= 10000) {
    plans.push({
      id: 'tabby_4',
      provider: 'tabby',
      installments: 4,
      amount: Math.ceil(amount / 4),
      total: amount,
      fee: 0,
      currency,
    });
  }

  // Tamara - 3 أقساط
  if (amount >= 100 && amount <= 8000) {
    plans.push({
      id: 'tamara_3',
      provider: 'tamara',
      installments: 3,
      amount: Math.ceil(amount / 3),
      total: amount,
      fee: 0,
      currency,
    });
  }

  // Tamara - الدفع بعد 30 يوم
  if (amount >= 100 && amount <= 5000) {
    plans.push({
      id: 'tamara_30',
      provider: 'tamara',
      installments: 1,
      amount: amount,
      total: amount,
      fee: 0,
      currency,
    });
  }

  return plans;
};

/**
 * التحقق من صحة بطاقة الائتمان (وهمي)
 */
export const validateCard = (cardNumber: string): { valid: boolean; type: string } => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  // بطاقات تجريبية صالحة
  const testCards: Record<string, string> = {
    '4111111111111111': 'visa',
    '4242424242424242': 'visa',
    '5555555555554444': 'mastercard',
    '5105105105105100': 'mastercard',
    '4000000000000002': 'visa', // للفشل
    '9700000000000000': 'mada',
  };

  if (testCards[cleanNumber]) {
    return { valid: true, type: testCards[cleanNumber] };
  }

  // التحقق من نوع البطاقة
  if (cleanNumber.startsWith('4')) {
    return { valid: cleanNumber.length === 16, type: 'visa' };
  }
  if (cleanNumber.startsWith('5')) {
    return { valid: cleanNumber.length === 16, type: 'mastercard' };
  }
  if (cleanNumber.startsWith('97')) {
    return { valid: cleanNumber.length === 16, type: 'mada' };
  }

  return { valid: false, type: 'unknown' };
};

/**
 * معالجة الدفع (وهمي)
 */
export const processPayment = async (request: PaymentRequest): Promise<PaymentResult> => {
  // محاكاة تأخير معالجة الدفع
  await new Promise(resolve => setTimeout(resolve, 2000));

  const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // محاكاة فشل بعض البطاقات
  if (request.cardDetails?.number === '4000000000000002') {
    return {
      success: false,
      transactionId,
      status: 'failed',
      message: 'Card declined by issuer',
      messageAr: 'تم رفض البطاقة من البنك المصدر',
    };
  }

  // محاكاة نجاح الدفع
  return {
    success: true,
    transactionId,
    status: 'completed',
    message: 'Payment successful',
    messageAr: 'تمت عملية الدفع بنجاح',
    receiptUrl: `/receipts/${transactionId}`,
    paidAt: new Date().toISOString(),
  };
};

/**
 * محاكاة Tabby checkout
 */
export const initTabbyCheckout = async (
  amount: number,
  currency: string,
  bookingId: string,
  customerInfo: PaymentRequest['customerInfo']
): Promise<{ checkoutUrl: string; sessionId: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const sessionId = `TABBY${Date.now()}`;
  
  return {
    checkoutUrl: `/mock-payment/tabby?session=${sessionId}&amount=${amount}`,
    sessionId,
  };
};

/**
 * محاكاة Tamara checkout
 */
export const initTamaraCheckout = async (
  amount: number,
  currency: string,
  bookingId: string,
  customerInfo: PaymentRequest['customerInfo']
): Promise<{ checkoutUrl: string; orderId: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const orderId = `TAMARA${Date.now()}`;
  
  return {
    checkoutUrl: `/mock-payment/tamara?order=${orderId}&amount=${amount}`,
    orderId,
  };
};

/**
 * التحقق من حالة الدفع
 */
export const checkPaymentStatus = async (
  transactionId: string
): Promise<PaymentResult> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // محاكاة حالة ناجحة دائماً
  return {
    success: true,
    transactionId,
    status: 'completed',
    message: 'Payment verified',
    messageAr: 'تم التحقق من الدفع',
    paidAt: new Date().toISOString(),
  };
};

/**
 * استرداد المبلغ (وهمي)
 */
export const refundPayment = async (
  transactionId: string,
  amount: number,
  reason?: string
): Promise<{ success: boolean; refundId: string; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    refundId: `REF${Date.now()}`,
    message: `تم استرداد مبلغ ${amount} بنجاح`,
  };
};

// تصدير الخدمة
export const paymentService = {
  methods: PAYMENT_METHODS,
  calculateInstallments: calculateInstallmentPlans,
  validateCard,
  process: processPayment,
  tabby: {
    init: initTabbyCheckout,
  },
  tamara: {
    init: initTamaraCheckout,
  },
  checkStatus: checkPaymentStatus,
  refund: refundPayment,
};

export default paymentService;
