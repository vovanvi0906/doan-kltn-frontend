import React, { useState } from 'react';
import { Wallet, PlusCircle, History, ArrowUpRight, ShieldCheck, X, AlertCircle } from 'lucide-react';

export default function WalletSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 border border-slate-800 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Ví FixGo Pay</h2>
            <p className="text-xs text-slate-400">Thanh toán an toàn, không dùng tiền mặt</p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn PCI-DSS
        </span>
      </div>

      {/* Balance Card */}
      <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 font-medium">Số dư khả dụng:</p>
          <p className="text-3xl font-black text-white tracking-tight mt-0.5">
            0 <span className="text-lg font-bold text-emerald-400">VNĐ</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Được bảo chứng bởi ngân hàng đối tác</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nạp tiền</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>Lịch sử</span>
          </button>
        </div>
      </div>

      {/* Payment Gateway Modal (Mockup Notice) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Cổng Thanh Toán Trực Tuyến</h3>
              <p className="text-xs text-amber-300/90 font-semibold mt-2 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                Trạng thái: Tính năng cổng thanh toán đang được phát triển.
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Hệ thống đang hoàn thiện tích hợp cổng thanh toán VNPay, MoMo và Chuyển khoản QR ngân hàng (VietQR). Hiện tại bạn có thể thanh toán trực tiếp bằng tiền mặt cho thợ sau khi hoàn thành công việc.
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Đã hiểu & Quay lại
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
