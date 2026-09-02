import React, { useState } from 'react';
import { Search, Zap, Droplets, Wind, Sparkles, Key, Wrench, Clock, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import BookingModal from '../components/BookingModal';

const CATALOG_SERVICES = [
  {
    id: 'srv-elec-1',
    category: 'electric',
    name: 'Khắc phục chập điện âm tường',
    desc: 'Dò tìm vị trí chập cháy, thay thế đường dây đứt ngầm, lắp aptomat chống giật',
    basePrice: 200000,
    unit: 'lần',
    duration: '45 - 60 phút',
    warranty: 'Bảo hành 30 ngày',
    popular: true,
  },
  {
    id: 'srv-elec-2',
    category: 'electric',
    name: 'Lắp đặt & Thay thế ổ cắm, bóng đèn',
    desc: 'Lắp đèn LED trang trí, thay công tắc cảm ứng, đi nẹp dây điện thẩm mỹ',
    basePrice: 120000,
    unit: 'điểm',
    duration: '30 phút',
    warranty: 'Bảo hành 15 ngày',
  },
  {
    id: 'srv-plumb-1',
    category: 'plumbing',
    name: 'Thông tắc bồn cầu & Lavabo',
    desc: 'Sử dụng máy lò xo chuyên dụng thông tắc nhanh, không đục phá sàn nhà',
    basePrice: 180000,
    unit: 'lần',
    duration: '30 - 45 phút',
    warranty: 'Bảo hành 30 ngày',
    popular: true,
  },
  {
    id: 'srv-plumb-2',
    category: 'plumbing',
    name: 'Sửa rò rỉ đường ống nước cấp / thoát',
    desc: 'Hàn ống nhiệt PPR, thay van phao tự ngắt bồn nước, thay vòi sen cao cấp',
    basePrice: 150000,
    unit: 'lần',
    duration: '45 phút',
    warranty: 'Bảo hành 30 ngày',
  },
  {
    id: 'srv-air-1',
    category: 'aircon',
    name: 'Vệ sinh máy lạnh treo tường (1.0 - 2.5 HP)',
    desc: 'Vệ sinh dàn nóng + lạnh bằng máy áp lực, xịt dung dịch diệt khuẩn, kiểm tra gas',
    basePrice: 180000,
    unit: 'bộ',
    duration: '40 - 50 phút',
    warranty: 'Bao xài không chảy nước',
    popular: true,
  },
  {
    id: 'srv-air-2',
    category: 'aircon',
    name: 'Nạp gas bổ sung R32 / R410A',
    desc: 'Đo áp suất gas chuẩn hãng, hút chân không, nạp gas tinh khiết làm lạnh sâu',
    basePrice: 250000,
    unit: 'lần',
    duration: '30 phút',
    warranty: 'Bảo hành 3 tháng',
  },
  {
    id: 'srv-clean-1',
    category: 'cleaning',
    name: 'Tổng vệ sinh nhà ở / Căn hộ',
    desc: 'Lau sàn, hút bụi, vệ sinh kính, khử khuẩn toilet và không gian bếp',
    basePrice: 100000,
    unit: 'giờ',
    duration: 'Tùy diện tích',
    warranty: 'Nghiệm thu hài lòng mới trả tiền',
  },
  {
    id: 'srv-lock-1',
    category: 'lock',
    name: 'Mở khóa cửa nhà / Khóa tay gạt khẩn cấp',
    desc: 'Thợ có mặt trong 15 phút mở khóa an toàn không làm hỏng ổ khóa',
    basePrice: 200000,
    unit: 'lần',
    duration: '15 - 20 phút',
    warranty: 'Bảo hành 30 ngày',
    popular: true,
  },
];

const CATEGORY_TABS = [
  { id: 'all', label: 'Tất cả dịch vụ' },
  { id: 'electric', label: '⚡ Điện gia dụng' },
  { id: 'plumbing', label: '💧 Ống nước & WC' },
  { id: 'aircon', label: '❄️ Điện lạnh & Máy giặt' },
  { id: 'cleaning', label: '✨ Dọn dẹp nhà' },
  { id: 'lock', label: '🔑 Khóa & Cửa' },
];

export default function ServicesCatalogView({ onOrderCreated }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingService, setBookingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredServices = CATALOG_SERVICES.filter((item) => {
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleBook = (srv) => {
    setBookingService(srv);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Danh Mục Dịch Vụ & Bảng Giá Minh Bạch</h1>
          <p className="text-xs text-slate-400 mt-1">
            Bảng giá tiêu chuẩn niêm yết công khai. Thợ cam kết không tự ý nâng giá ngoài báo giá hệ thống.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên dịch vụ hoặc sự cố..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Services List Table / Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 shadow-lg flex flex-col justify-between transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-bold text-white leading-tight">{service.name}</h3>
                {service.popular && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                    PHỔ BIẾN
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{service.desc}</p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>{service.duration}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{service.warranty}</span>
                </span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500">Giá khởi điểm</span>
                <p className="text-lg font-black text-emerald-400">
                  {service.basePrice.toLocaleString('vi-VN')} đ <span className="text-xs text-slate-400 font-normal">/ {service.unit}</span>
                </p>
              </div>

              <button
                onClick={() => handleBook(service)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>Đặt thợ ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form Modal */}
      <BookingModal
        service={bookingService}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrderCreated={onOrderCreated}
      />
    </div>
  );
}
