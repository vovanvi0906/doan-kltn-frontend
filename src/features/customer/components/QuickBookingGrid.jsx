import React, { useState, useEffect } from 'react';
import { Zap, Droplets, Wind, Sparkles, Key, Wrench, ChevronRight, ShieldCheck } from 'lucide-react';
import BookingModal from './BookingModal';
import customerOrderService from '../services/customerOrderService';

const DEFAULT_CATEGORIES = [
  {
    id: 'srv-electric-01',
    name: 'Sửa điện gia dụng',
    desc: 'Chập điện, hỏng atomat, ổ cắm & quạt trần',
    basePrice: 150000,
    icon: Zap,
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    iconColor: 'text-amber-400',
    borderColor: 'hover:border-amber-500/50',
    popular: true,
  },
  {
    id: 'srv-plumbing-02',
    name: 'Sửa ống nước & WC',
    desc: 'Rò rỉ ống, thay vòi sen, thông tắc lavabo',
    basePrice: 180000,
    icon: Droplets,
    gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    iconColor: 'text-cyan-400',
    borderColor: 'hover:border-cyan-500/50',
    popular: true,
  },
  {
    id: 'srv-aircon-03',
    name: 'Vệ sinh & Nạp gas máy lạnh',
    desc: 'Rửa máy lạnh, nạp gas R32/R410A, xử lý chảy nước',
    basePrice: 250000,
    icon: Wind,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    iconColor: 'text-emerald-400',
    borderColor: 'hover:border-emerald-500/50',
    popular: true,
  },
  {
    id: 'srv-cleaning-04',
    name: 'Dọn dẹp nhà theo giờ',
    desc: 'Lau dọn nhà ở, khử khuẩn & tổng vệ sinh',
    basePrice: 120000,
    icon: Sparkles,
    gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
    iconColor: 'text-purple-400',
    borderColor: 'hover:border-purple-500/50',
  },
  {
    id: 'srv-lock-05',
    name: 'Sửa khóa & Mở khóa',
    desc: 'Mở khóa khẩn cấp 24/7, thay ổ khóa vân tay',
    basePrice: 200000,
    icon: Key,
    gradient: 'from-rose-500/20 via-red-500/10 to-transparent',
    iconColor: 'text-rose-400',
    borderColor: 'hover:border-rose-500/50',
  },
  {
    id: 'srv-mechanic-06',
    name: 'Cơ khí & Nhôm kính',
    desc: 'Hàn cửa sắt, sửa bản lề, cắt kính cường lực',
    basePrice: 300000,
    icon: Wrench,
    gradient: 'from-indigo-500/20 via-blue-500/10 to-transparent',
    iconColor: 'text-indigo-400',
    borderColor: 'hover:border-indigo-500/50',
  },
];

export default function QuickBookingGrid({ onOrderCreated }) {
  const [services, setServices] = useState(DEFAULT_CATEGORIES);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadBackendServices = async () => {
      try {
        const backendServices = await customerOrderService.getServices();
        if (Array.isArray(backendServices) && backendServices.length > 0) {
          // Merge icon and visual styles
          const merged = backendServices.map((bs, index) => {
            const fallback = DEFAULT_CATEGORIES[index % DEFAULT_CATEGORIES.length];
            return {
              ...fallback,
              ...bs,
              icon: fallback.icon,
              gradient: fallback.gradient,
              iconColor: fallback.iconColor,
              borderColor: fallback.borderColor,
            };
          });
          setServices(merged);
        }
      } catch (e) {
        console.log('Using default client services');
      }
    };
    loadBackendServices();
  }, []);

  const handleOpenBooking = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>⚡ Đặt Dịch Vụ Nhanh (Quick Booking)</span>
          </h2>
          <p className="text-xs text-slate-400">Chọn dịch vụ để kết nối thợ gần bạn trong 5km</p>
        </div>
        <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
          6 Dịch vụ sẵn sàng
        </span>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {services.map((item) => {
          const IconComponent = item.icon || Wrench;
          return (
            <div
              key={item.id}
              onClick={() => handleOpenBooking(item)}
              className={`group relative overflow-hidden rounded-2xl bg-slate-900/90 p-4 border border-slate-800/80 ${item.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between`}
            >
              {/* Card gradient glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-40 group-hover:opacity-80 transition-opacity`} />

              <div className="relative z-10 space-y-3">
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center ${item.iconColor} group-hover:scale-110 transition-transform shadow-inner`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  {item.popular && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      HOT
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs mt-3">
                <span className="font-extrabold text-emerald-400">
                  {Number(item.basePrice || 150000).toLocaleString('vi-VN')} đ
                </span>
                <span className="flex items-center text-[11px] text-slate-500 group-hover:text-white transition-colors">
                  <span>Đặt ngay</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Form Modal */}
      <BookingModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrderCreated={(newOrder) => {
          if (onOrderCreated) onOrderCreated(newOrder);
        }}
      />
    </section>
  );
}
