import { Product, PaymentMethodId, Transaction } from '../types';
import { saveTransaction, addNotification } from './storage';

// Helper to generate realistic transaction serial numbers
function generateSerialNumber(provider: string): string {
  const timestamp = Date.now().toString().slice(-8);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SN${provider.toUpperCase().slice(0, 4)}${timestamp}${randomSuffix}`;
}

// Generate 20-digit PLN Token (format: XXXX-XXXX-XXXX-XXXX-XXXX)
function generatePLNToken(): string {
  const digits: string[] = [];
  for (let i = 0; i < 5; i++) {
    const chunk = Math.floor(1000 + Math.random() * 9000).toString();
    digits.push(chunk);
  }
  return digits.join('-');
}

export interface CreateTransactionParams {
  product: Product;
  destination: string;
  secondaryDestination?: string;
  customerName?: string;
  paymentMethod: PaymentMethodId;
  paymentMethodName: string;
}

export class PaymentService {
  /**
   * Initializes a transaction with PENDING status
   */
  static createTransaction(params: CreateTransactionParams): Transaction {
    const transactionId = 'PLK' + Date.now().toString(36).toUpperCase() + Math.floor(100 + Math.random() * 900);
    const total = params.product.price + params.product.adminFee;
    
    const transaction: Transaction = {
      transactionId,
      productId: params.product.id,
      category: params.product.category,
      provider: params.product.provider,
      providerName: params.product.name.split(' ')[1] || params.product.provider,
      productName: params.product.name,
      productDescription: params.product.description,
      destination: params.destination,
      secondaryDestination: params.secondaryDestination,
      customerName: params.customerName,
      amount: params.product.price,
      adminFee: params.product.adminFee,
      total,
      paymentMethod: params.paymentMethod,
      paymentMethodName: params.paymentMethodName,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveTransaction(transaction);
    return transaction;
  }

  /**
   * Simulates payment verification and digital fulfillment
   */
  static async processPayment(
    transactionId: string, 
    onProgress?: (stage: 'verifying' | 'fulfilling' | 'complete') => void
  ): Promise<Transaction> {
    return new Promise((resolve) => {
      // Step 1: Verifying payment
      if (onProgress) onProgress('verifying');
      
      setTimeout(() => {
        // Step 2: Fulfilling digital product
        if (onProgress) onProgress('fulfilling');

        setTimeout(() => {
          // Fetch existing to update
          const stored = localStorage.getItem('pulsaku_transactions_v1');
          const transactions: Transaction[] = stored ? JSON.parse(stored) : [];
          const index = transactions.findIndex(t => t.transactionId === transactionId);
          
          if (index === -1) {
            throw new Error('Transaksi tidak ditemukan');
          }

          const current = transactions[index];
          const isSuccess = true; // High reliability simulation
          
          let updated: Transaction;

          if (isSuccess) {
            const isPLN = current.category === 'pln';
            updated = {
              ...current,
              status: 'SUCCESS',
              serialNumber: generateSerialNumber(current.provider),
              tokenPLN: isPLN ? generatePLNToken() : undefined,
              kwhPLN: isPLN ? `${(current.amount / 1444.7).toFixed(1)} kWh` : undefined,
              updatedAt: new Date().toISOString()
            };

            // Send notification
            addNotification({
              type: 'transaction',
              title: `Transaksi Berhasil - ${updated.productName}`,
              message: `Pembelian ${updated.productName} untuk tujuan ${updated.destination} berhasil diproses.`,
              transactionId: updated.transactionId,
              categoryTarget: updated.category,
              isRead: false
            });
          } else {
            updated = {
              ...current,
              status: 'FAILED',
              failureReason: 'Gangguan jaringan provider sementara. Saldo tidak terpotong.',
              updatedAt: new Date().toISOString()
            };

            addNotification({
              type: 'transaction',
              title: `Transaksi Gagal - ${updated.productName}`,
              message: `Pembelian untuk ${updated.destination} gagal. Silakan coba beberapa saat lagi.`,
              transactionId: updated.transactionId,
              categoryTarget: updated.category,
              isRead: false
            });
          }

          saveTransaction(updated);
          if (onProgress) onProgress('complete');
          resolve(updated);
        }, 1800);
      }, 1400);
    });
  }
}
