import React, { useState, useEffect } from 'react';
import { Radio, CheckCircle, Clock, MapPin, Wrench, UserCheck, RefreshCw, ChevronRight } from 'lucide-react';
import customerOrderService from '../services/customerOrderService';

const STATUS_CONFIG = {
  SEARCHING: {
    label: 'Đang quét tìm thợ...',
    bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    icon: Radio,
    animate: true,
  },
  ASSIGNED: {
    label: 'Thợ đã nhận đơn',
    bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    icon: UserCheck,
  },
  WORKER_ARRIVING: {
    label: 'Thợ đang di chuyển đến',
    bg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    icon: Clock,
  },
  ARRIVED: {
    label: 'Thợ đã có mặt tại điểm hẹn',
    bg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    icon: MapPin,
  },
  IN_PROGRESS: {
    label: 'Đang thực hiện sửa chữa',
    bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    icon: Wrench,
  },
  COMPLETED: {
    label: 'Đã hoàn thành',
    bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Đã hủy',
    bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    icon: Clock,
  },
};

export default function ActiveOrdersList({ refreshTrigger }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await customerOrderService.getMyOrders();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.warn('Cannot fetch my orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshTrigger]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>📦 Đơn Hàng Của Bạn (Active Orders)</span>
          </h2>
          <p className="text-xs text-slate-400">Theo dõi tiến độ thực hiện dịch vụ thời gian thực</p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
          title="Tải lại danh sách"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
        </button>
      </div>

      {loading && orders.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <span>Đang tải danh sách đơn hàng...</span>
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-dashed border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-500 mx-auto">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-300">Chưa có đơn hàng nào đang hoạt động</h3>
            <p className="text-xs text-slate-500 mt-0.5">Hãy chọn một dịch vụ ở trên để kết nối thợ ngay lập tức</p>
          </div>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-3">
          {orders.map((order) => {
            const statusInfo = STATUS_CONFIG[order.status] || {
              label: order.status || 'Chờ xử lý',
              bg: 'bg-slate-800 text-slate-300 border-slate-700',
              icon: Clock,
            };
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order.id}
                className="relative overflow-hidden rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-5 shadow-lg space-y-3.5 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">
                        {order.service?.name || 'Dịch vụ sửa chữa tại nhà'}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-500">
                        #{order.id.slice(0, 8)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="line-clamp-1">{order.pickupAddress || '268 Lý Thường Kiệt, Q.10'}</span>
                    </p>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg} shrink-0`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${statusInfo.animate ? 'animate-pulse' : ''}`} />
                    <span>{statusInfo.label}</span>
                  </span>
                </div>

                {/* Worker Assigned Info */}
                {order.worker && (
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        👨‍🔧
                      </div>
                      <div>
                        <p className="font-bold text-white">{order.worker.fullName || 'Thợ đối tác FixGo'}</p>
                        <p className="text-[11px] text-slate-400">SĐT: {order.worker.user?.phone || '0987.xxx.xxx'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400">
                      ⭐ {order.worker.ratingAvg || 5.0}
                    </span>
                  </div>
                )}

                {/* Footer Price & Date */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  <div className="text-right">
                    <span className="text-slate-400 text-[11px] mr-1">Tổng cộng:</span>
                    <span className="font-black text-emerald-400 text-sm">
                      {Number(order.totalPrice || 150000).toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
