import React, { useState } from 'react';
import { Wallet, PlusCircle, ArrowDownLeft, ArrowUpRight, ShieldCheck, CreditCard, QrCode, X, AlertCircle } from 'lucide-react';

export default function WalletView() {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('vnpay');

  const TRANSACTIONS = [
    { id: 'TXN-01', title: 'Thanh toán dịch vụ Sửa điện âm tường', date: '02/09/2026', amount: -200000, type: 'PAYMENT', status: 'SUCCESS' },
    { id: 'TXN-02', title: 'Nạp tiền vào ví qua VNPay QR', date: '01/09/2026', amount: +500000, type: 'DEPOSIT', status: 'SUCCESS' },
    { id: 'TXN-03', title: 'Thanh toán Vệ sinh máy lạnh 1.5HP', date: '28/08/2026', amount: -180000, type: 'PAYMENT', status: 'SUCCESS' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white tracking-tight">Ví Điện Tử FixGo Pay & Quản Lý Giao Dịch</h1>
        <p className="text-xs text-slate-400 mt-1">
          Nạp tiền tiện lợi, thanh toán dịch vụ tự động sau khi nghiệm thu, không lo tiền lẻ.
        </p>
      </div>

      {/* Wallet Virtual Card & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Virtual Card */}
        <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-7 text-white shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-widest uppercase text-emerald-200">FIXGO PLATINUM PAY</span>
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
          </div>

          <div>
            <span className="text-xs text-emerald-100/80 font-medium">Số dư khả dụng</span>
            <p className="text-4xl font-black tracking-tight mt-1">
              0 <span className="text-2xl font-bold">VNĐ</span>
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/15 text-xs text-emerald-100">
            <div>
              <span className="text-[10px] text-emerald-200 block uppercase">Chủ ví</span>
              <span className="font-bold">VÕ VĂN KHÁCH HÀNG</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 block uppercase">Mã ví</span>
              <span className="font-mono font-bold">**** 8868</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 block uppercase">Trạng thái</span>
              <span className="font-bold text-emerald-300">Đã kích hoạt</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white">Nạp tiền siêu tốc</h3>
            <p className="text-xs text-slate-400 mt-1">Hỗ trợ quét mã VietQR ngân hàng, ví MoMo, ZaloPay và thẻ ATM.</p>
          </div>

          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>NẠP TIỀN VÀO VÍ NGAY</span>
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Lịch sử giao dịch gần đây</h3>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="divide-y divide-slate-800">
            {TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.amount > 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                    }`}
                  >
                    {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{tx.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{tx.date} • Mã GD: {tx.id}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-sm font-black ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.amount > 0 ? `+${tx.amount.toLocaleString('vi-VN')} đ` : `${tx.amount.toLocaleString('vi-VN')} đ`}
                  </span>
                  <span className="block text-[10px] text-emerald-400/90 font-bold uppercase">Thành công</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deposit Modal Notice */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <button
              onClick={() => setIsDepositModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Nạp Tiền Qua Cổng Trực Tuyến</h3>
              <p className="text-xs text-amber-300 font-semibold bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 mt-2">
                Trạng thái: Tính năng cổng thanh toán đang được phát triển.
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Các phương thức thanh toán VNPay, MoMo, VietQR sẽ sớm hoạt động. Hiện bạn có thể trả tiền mặt trực tiếp cho thợ sau khi hoàn thành dịch vụ.
              </p>
            </div>

            <button
              onClick={() => setIsDepositModalOpen(false)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
