import React, { useState } from 'react';
import { X, MapPin, Navigation, Clock, AlertCircle, CheckCircle2, Radio, Sparkles } from 'lucide-react';
import customerOrderService from '../services/customerOrderService';

export default function BookingModal({ service, isOpen, onClose, onOrderCreated }) {
  if (!isOpen || !service) return null;

  const [address, setAddress] = useState('268 Lý Thường Kiệt, Phường 14, Quận 10, TP. Hồ Chí Minh');
  const [lat, setLat] = useState(10.762622);
  const [lng, setLng] = useState(106.660172);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const payload = {
        serviceId: service.id || 'd9b3a0e8-78b1-4f1b-8012-3a5c89e20a11',
        pickupLat: lat,
        pickupLng: lng,
        pickupAddress: address,
        description: note || `Yêu cầu dịch vụ: ${service.name}`,
        note: note,
      };

      console.log('🚀 [Web Portal] Đặt thợ nhanh với payload:', payload);
      const res = await customerOrderService.createOrder(payload);
      
      const createdOrder = res.order || res;
      setSuccessOrder(createdOrder);
      if (onOrderCreated) {
        onOrderCreated(createdOrder);
      }
    } catch (err) {
      console.error('❌ [Booking Error]:', err);
      const msg = err.friendlyMessage || err.response?.data?.message || err.message || 'Không thể tạo đơn hàng. Vui lòng kiểm tra lại!';
      setErrorMessage(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {successOrder ? (
          /* Success Screen with Searching Radar */
          <div className="py-6 text-center space-y-5">
            <div className="relative w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <Radio className="w-10 h-10 relative z-10 animate-pulse" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                ĐÃ PHÁT SÓNG ĐƠN HÀNG
              </span>
              <h3 className="text-2xl font-black text-white mt-2">Đang tìm thợ gần bạn...</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
                Hệ thống đang quét các thợ trực tuyến trong bán kính 5km qua WebSocket & PostGIS.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-left space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Mã đơn hàng:</span>
                <span className="font-mono text-blue-400 font-semibold">{successOrder.id?.slice(0, 13) || 'ORD-NEW'}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dịch vụ:</span>
                <span className="text-white font-medium">{service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Giá khởi điểm:</span>
                <span className="text-emerald-400 font-bold">{Number(service.basePrice || 150000).toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              Đóng và theo dõi trên Dashboard
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Đặt dịch vụ theo yêu cầu (On-Demand)</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{service.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{service.desc || 'Thợ sẽ có mặt trong vòng 15-30 phút sau khi nhận đơn.'}</p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* GPS & Address */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Địa chỉ thực hiện dịch vụ</span>
                <span className="text-[11px] font-normal text-emerald-400 flex items-center gap-1">
                  <Navigation className="w-3 h-3" /> GPS: {lat.toFixed(4)}, {lng.toFixed(4)}
                </span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-rose-400 pointer-events-none" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ nhà của bạn"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Note for worker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Mô tả chi tiết sự cố (Tùy chọn)
              </label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Cần kiểm tra rò rỉ điện ở phòng khách, vui lòng mang theo thang..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
              />
            </div>

            {/* Price Preview */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-blue-950/40 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Giá dịch vụ khởi điểm:</p>
                <p className="text-xs text-slate-500 mt-0.5">* Đã bao gồm công khảo sát</p>
              </div>
              <p className="text-2xl font-black text-emerald-400 tracking-tight">
                {Number(service.basePrice || 150000).toLocaleString('vi-VN')} đ
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang khởi tạo đơn hàng...</span>
                </>
              ) : (
                <>
                  <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span>TÌM THỢ NGAY (POST /api/orders)</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
