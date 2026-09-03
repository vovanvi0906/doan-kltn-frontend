import React from 'react';
import { X, ShieldAlert, Loader2 } from 'lucide-react';

export default function DeleteServiceModal({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  isSubmitting = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-40"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Danger Icon */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1 pr-6">
            <h3 className="text-base font-bold text-white tracking-tight leading-snug">
              Xác Nhận Xóa Gói Dịch Vụ
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bạn có chắc chắn muốn xóa dịch vụ này khỏi hệ thống?
            </p>
            {serviceName && (
              <div className="text-xs font-bold text-rose-300 mt-1 p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 truncate">
                Dịch vụ: {serviceName}
              </div>
            )}
          </div>
        </div>

        {/* Safety Note */}
        <p className="text-[11px] text-slate-500 italic p-2 rounded-lg bg-slate-950/40 border border-slate-800/50">
          💡 Lưu ý: Nếu dịch vụ này đã có đơn hàng hoặc thợ đăng ký, hệ thống sẽ tự động chuyển sang trạng thái <strong>Tạm Ngưng (Soft Delete)</strong> để giữ toàn vẹn dữ liệu.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer disabled:opacity-40"
          >
            Hủy thao tác
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/25 border border-rose-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang xóa...</span>
              </>
            ) : (
              <span>Xác nhận xóa</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
