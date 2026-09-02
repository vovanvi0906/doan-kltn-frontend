import React from 'react';
import QuickBookingGrid from '../components/QuickBookingGrid';
import ActiveOrdersList from '../components/ActiveOrdersList';
import AiDiagnosticCard from '../components/AiDiagnosticCard';
import WalletSection from '../components/WalletSection';
import { Sparkles, Shield, Clock, Award, Star, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../store/authStore';

const TOP_WORKERS = [
  {
    name: 'Trần Văn Hùng',
    role: 'Chuyên gia Điện nước',
    rating: 4.98,
    reviews: 184,
    distance: '1.1 km',
    avatar: '👨‍🔧',
    status: 'Trực tuyến',
  },
  {
    name: 'Lê Minh Tuấn',
    role: 'Kỹ thuật viên Điện lạnh',
    rating: 4.95,
    reviews: 142,
    distance: '2.3 km',
    avatar: '👨‍🏭',
    status: 'Trực tuyến',
  },
  {
    name: 'Phạm Quốc Bảo',
    role: 'Thợ Khóa & Cửa cuốn',
    rating: 5.0,
    reviews: 96,
    distance: '0.8 km',
    avatar: '👷‍♂️',
    status: 'Trực tuyến',
  },
];

export default function HomeOverviewView({ onOrderCreated, setActiveTab }) {
  const { user } = useAuth();
  const userDisplayName = user?.fullName || user?.name || user?.email?.split('@')[0] || 'Khách hàng';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Hero Promo Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-7 sm:p-9 border border-blue-500/20 shadow-2xl">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>KẾT NỐI THỢ TẬN NƠI TRONG 15 PHÚT</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            Dịch vụ sửa chữa gia đình <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">FixGo</span> Uy tín & Tiện lợi
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Hơn 1.000+ thợ tay nghề cao đã qua kiểm duyệt hồ sơ KYC và xác thực khuôn mặt. Giá cả minh bạch, bảo hành dịch vụ 30 ngày.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('services')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              <span>XEM BẢNG GIÁ DỊCH VỤ</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('ai-diagnosis')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Chẩn đoán sự cố</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Phục vụ 24/7 siêu tốc</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Thợ có mặt chỉ sau 15-30 phút</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Thợ xác thực KYC & CCCD</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Lý lịch tư pháp rõ ràng, an tâm</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Bảo hành dịch vụ 30 ngày</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Cam kết hoàn tiền nếu không hài lòng</p>
          </div>
        </div>
      </div>

      {/* 3. Lưới Đặt Dịch Vụ Nhanh (Quick Booking) */}
      <QuickBookingGrid onOrderCreated={onOrderCreated} />

      {/* 4. Hai cột: Đơn hàng đang chạy & Top Thợ uy tín */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActiveOrdersList />
        </div>

        {/* Cột phải: Top Thợ xuất sắc gần bạn */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>⭐ Thợ Uy Tín Gần Bạn (5km)</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-bold">Trực tuyến</span>
          </div>

          <div className="space-y-3">
            {TOP_WORKERS.map((worker, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-all shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                    {worker.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white">{worker.name}</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <p className="text-[11px] text-slate-400">{worker.role}</p>
                    <p className="text-[10px] text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
                      <span>⭐ {worker.rating}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">{worker.reviews} đánh giá</span>
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                  {worker.distance}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('services')}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all text-center cursor-pointer"
          >
            Xem tất cả thợ trong khu vực
          </button>
        </div>
      </div>

      {/* 5. Hai phân hệ AI & Ví tiền */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AiDiagnosticCard />
        <WalletSection />
      </div>
    </div>
  );
}
