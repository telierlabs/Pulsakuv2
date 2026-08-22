import React, { useState, useEffect, useMemo } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Copy, 
  X, 
  Share2, 
  RefreshCw 
} from 'lucide-react';
import { Transaction, TransactionStatus } from '../types';
import { getStoredTransactions, saveTransaction } from '../services/storage';
import { formatRupiah, formatDateIndo, copyToClipboard } from '../utils/formatters';
import { ProviderIcon } from '../components/common/ProviderIcon';
import { Badge } from '../components/common/Badge';
import { useToast } from '../components/common/Toast';

interface HistoryViewProps {
  onSelectProductAgain?: (productId: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const { showToast } = useToast();

  const loadTransactions = () => {
    setTransactions(getStoredTransactions());
  };

  useEffect(() => {
    loadTransactions();
    const handleStorage = () => loadTransactions();
    window.addEventListener('pulsaku_storage_update', handleStorage);
    return () => window.removeEventListener('pulsaku_storage_update', handleStorage);
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        t.productName.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.transactionId.toLowerCase().includes(q) ||
        t.provider.toLowerCase().includes(q)
      );
    });
  }, [transactions, filterStatus, searchQuery]);

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text);
    showToast(`${label} disalin ke clipboard`, 'success');
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge variant="success">Berhasil</Badge>;
      case 'PROCESSING':
      case 'PENDING':
        return <Badge variant="warning">Diproses</Badge>;
      case 'FAILED':
      case 'EXPIRED':
        return <Badge variant="danger">Gagal</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in duration-200" id="history-view">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
            Riwayat Transaksi
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Daftar pembelian produk digital dan struk pembayaran Anda
          </p>
        </div>
        <button
          onClick={loadTransactions}
          className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors"
          title="Segarkan"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID transaksi, produk, atau nomor tujuan..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:border-blue-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'SUCCESS', label: 'Berhasil' },
            { id: 'PROCESSING', label: 'Diproses' },
            { id: 'FAILED', label: 'Gagal' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilterStatus(chip.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === chip.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200/80">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-400">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-800">Belum Ada Transaksi</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Transaksi pembelian pulsa, paket data, PLN, atau voucher game Anda akan tercatat rapi di sini.
            </p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.transactionId}
              onClick={() => setSelectedTx(tx)}
              className="p-4 rounded-2xl bg-white border border-neutral-200/80 hover:border-blue-400 hover:shadow-xs transition-all flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <ProviderIcon provider={tx.provider} size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate group-hover:text-blue-600 transition-colors">
                      {tx.productName}
                    </h4>
                    {getStatusBadge(tx.status)}
                  </div>
                  <div className="text-xs font-mono text-neutral-500 truncate mt-0.5">
                    {tx.destination} {tx.secondaryDestination && `(${tx.secondaryDestination})`}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {formatDateIndo(tx.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-neutral-900 block">
                    {formatRupiah(tx.total)}
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                    {tx.paymentMethod.toUpperCase()}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Transaction Detail Modal / Receipt */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900">Detail Struk Pembayaran</h3>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
              <div className="text-center pb-2 border-b border-neutral-100">
                <div className="flex justify-center mb-1.5">
                  {getStatusBadge(selectedTx.status)}
                </div>
                <div className="text-2xl font-black text-neutral-900 font-mono">
                  {formatRupiah(selectedTx.total)}
                </div>
                <span className="text-[11px] text-neutral-400 font-mono">
                  ID: {selectedTx.transactionId}
                </span>
              </div>

              {/* PLN Token if exists */}
              {selectedTx.tokenPLN && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase">Kode Token Listrik</span>
                  <div className="font-mono text-base sm:text-lg font-black text-neutral-900">
                    {selectedTx.tokenPLN}
                  </div>
                  <button
                    onClick={() => handleCopy(selectedTx.tokenPLN!, 'Token')}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 hover:underline pt-1"
                  >
                    <Copy className="w-3 h-3" /> Salin Kode Token
                  </button>
                </div>
              )}

              {/* Serial Number */}
              {selectedTx.serialNumber && !selectedTx.tokenPLN && (
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">Serial Number</span>
                    <span className="font-mono text-xs font-bold text-neutral-900">{selectedTx.serialNumber}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(selectedTx.serialNumber!, 'SN')}
                    className="p-1 text-neutral-500 hover:text-blue-600"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Meta fields */}
              <div className="space-y-2 text-neutral-600">
                <div className="flex justify-between">
                  <span>Nama Produk</span>
                  <span className="font-bold text-neutral-900">{selectedTx.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nomor / ID Tujuan</span>
                  <span className="font-mono font-bold text-neutral-900">{selectedTx.destination}</span>
                </div>
                {selectedTx.customerName && (
                  <div className="flex justify-between">
                    <span>Nama Pelanggan</span>
                    <span className="font-bold text-neutral-900">{selectedTx.customerName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Harga Produk</span>
                  <span>{formatRupiah(selectedTx.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Admin</span>
                  <span>{selectedTx.adminFee === 0 ? 'Gratis' : formatRupiah(selectedTx.adminFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Metode Pembayaran</span>
                  <span className="font-semibold text-neutral-900">{selectedTx.paymentMethodName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu Transaksi</span>
                  <span>{formatDateIndo(selectedTx.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex gap-2">
              <button
                onClick={() => {
                  const summary = `Struk Pulsaku\nID: ${selectedTx.transactionId}\nProduk: ${selectedTx.productName}\nTujuan: ${selectedTx.destination}\nTotal: ${formatRupiah(selectedTx.total)}\nStatus: ${selectedTx.status}`;
                  handleCopy(summary, 'Struk');
                }}
                className="flex-1 py-2.5 px-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Salin Struk
              </button>
              <button
                onClick={() => setSelectedTx(null)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
