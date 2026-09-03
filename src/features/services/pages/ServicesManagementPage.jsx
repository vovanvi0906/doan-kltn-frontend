import React, { useState, useEffect } from 'react';
import { adminServicesService } from '../services/adminServices.service';
import ServiceFormModal from '../components/ServiceFormModal';
import DeleteServiceModal from '../components/DeleteServiceModal';
import {
  Wrench,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Pencil,
  Trash2,
  X,
  Zap,
  Snowflake,
  Droplets,
  Key,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Layers,
  Tag,
} from 'lucide-react';

/**
 * Enterprise Services Management CRUD Page for Admin (ServicesManagementPage.jsx)
 * - Vercel / Linear Style Enterprise Data Grid
 * - Gradient "+ Thêm Dịch Vụ Mới" Action Button
 * - 5-Column Data Table with category badges, emerald monospace pricing, and quick toggle switches
 * - Custom Glassmorphism Modals for Add/Edit and Delete (Zero window.confirm / alert)
 * - Viewport Lock with Internal Smooth Table Scroll, Strict 8pt Grid System
 */
export default function ServicesManagementPage() {
  // State Management
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [activeStatusTab, setActiveStatusTab] = useState('ALL'); // ALL, true, false
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Action State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Format Currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(Number(amount) || 0);
  };

  // Get Dynamic Category Icon
  const getCategoryIcon = (categoryName = '', serviceName = '') => {
    const text = `${categoryName} ${serviceName}`.toLowerCase();
    if (text.includes('điện') && !text.includes('lạnh')) return <Zap className="w-4 h-4 text-amber-500" />;
    if (text.includes('lạnh') || text.includes('máy lạnh')) return <Snowflake className="w-4 h-4 text-sky-400" />;
    if (text.includes('nước') || text.includes('ống')) return <Droplets className="w-4 h-4 text-blue-500" />;
    if (text.includes('khóa')) return <Key className="w-4 h-4 text-yellow-500" />;
    if (text.includes('vệ sinh') || text.includes('dọn')) return <Sparkles className="w-4 h-4 text-emerald-400" />;
    return <Wrench className="w-4 h-4 text-indigo-400" />;
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await adminServicesService.getCategories();
      if (Array.isArray(res)) {
        setCategories(res);
      } else if (res?.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  // Fetch Services Data
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await adminServicesService.getServices({
        isActive: activeStatusTab === 'ALL' ? undefined : activeStatusTab,
        categoryId: selectedCategory === 'ALL' ? undefined : selectedCategory,
        search: searchTerm,
        page: pagination.page,
        limit: pagination.limit,
      });

      if (res?.data) {
        setServices(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } else if (Array.isArray(res)) {
        setServices(res);
      }
    } catch (err) {
      console.error('Fetch services error:', err);
      showToast('error', 'Không thể tải danh sách dịch vụ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [activeStatusTab, selectedCategory, pagination.page]);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchServices();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchServices();
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingService(null);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (service) => {
    setEditingService(service);
    setIsFormModalOpen(true);
  };

  // Save Service (Create or Update)
  const handleSaveService = async (serviceData) => {
    try {
      setIsSaving(true);
      if (editingService) {
        await adminServicesService.updateService(editingService.id, serviceData);
        showToast('success', `Đã cập nhật dịch vụ "${serviceData.name}" thành công.`);
      } else {
        await adminServicesService.createService(serviceData);
        showToast('success', `Đã tạo mới dịch vụ "${serviceData.name}" thành công.`);
      }
      setIsFormModalOpen(false);
      setEditingService(null);
      fetchServices();
    } catch (err) {
      showToast('error', err.friendlyMessage || 'Lỗi khi lưu thông tin dịch vụ.');
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Toggle Status
  const handleToggleStatus = async (service) => {
    try {
      await adminServicesService.toggleServiceStatus(service.id);
      const nextState = !service.isActive;
      showToast('success', `Đã ${nextState ? 'kích hoạt' : 'tạm ngưng'} dịch vụ "${service.name}".`);
      fetchServices();
    } catch (err) {
      showToast('error', err.friendlyMessage || 'Lỗi khi đổi trạng thái dịch vụ.');
    }
  };

  // Delete Service (Via Custom Modal)
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await adminServicesService.deleteService(deleteTarget.id);
      showToast('success', res?.message || `Đã xóa dịch vụ "${deleteTarget.name}".`);
      setDeleteTarget(null);
      fetchServices();
    } catch (err) {
      showToast('error', err.friendlyMessage || 'Lỗi khi xóa dịch vụ.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between select-none space-y-3 overflow-hidden transition-colors duration-200">
      {/* ========================================= */}
      {/* GLASSMORPHISM TOAST NOTIFICATION (TOP RIGHT) */}
      {/* ========================================= */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 p-3.5 rounded-xl border backdrop-blur-xl transition-all duration-200 flex items-center gap-2.5 shadow-2xl animate-in fade-in slide-in-from-top-4 ${
            toast.type === 'error'
              ? 'bg-rose-950/85 border-rose-500/40 text-rose-200 shadow-rose-950/50'
              : 'bg-emerald-950/85 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <div className="text-xs font-semibold pr-2">{toast.message}</div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================= */}
      {/* 1. HEADER ROW: TIÊU ĐỀ & NÚT THÊM MỚI */}
      {/* ========================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Quản Lý Danh Mục Dịch Vụ
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/30">
              SERVICES CRUD
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Thiết lập các gói dịch vụ, điều chỉnh giá khởi điểm và quản lý trạng thái cung cấp cho khách hàng
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-500' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          {/* Nút Thêm Dịch Vụ Mới Chuẩn Vercel Gradient */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Dịch Vụ Mới</span>
          </button>
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. FILTER TABS & SEARCH / CATEGORY TOOLBAR */}
      {/* ========================================= */}
      <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-[#1e293b]/40 border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
        {/* Status Tabs (Segmented Control) */}
        <div className="p-1 rounded-lg bg-slate-200/60 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 flex items-center text-xs w-full md:w-auto overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveStatusTab('ALL')}
            className={`px-3 py-1 rounded-md transition-all duration-150 cursor-pointer font-medium whitespace-nowrap ${
              activeStatusTab === 'ALL'
                ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tất Cả Dịch Vụ ({activeStatusTab === 'ALL' ? pagination.total || services.length : '•'})
          </button>

          <button
            type="button"
            onClick={() => setActiveStatusTab('true')}
            className={`px-3 py-1 rounded-md transition-all duration-150 cursor-pointer font-medium whitespace-nowrap ${
              activeStatusTab === 'true'
                ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Đang Hoạt Động
          </button>

          <button
            type="button"
            onClick={() => setActiveStatusTab('false')}
            className={`px-3 py-1 rounded-md transition-all duration-150 cursor-pointer font-medium whitespace-nowrap ${
              activeStatusTab === 'false'
                ? 'bg-slate-600 text-white shadow-2xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tạm Ngưng
          </button>
        </div>

        {/* Search & Category Filter Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên gói, mô tả dịch vụ..."
              className="w-full pl-8 pr-7 py-1.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-2.5 pr-7 py-1.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 cursor-pointer shadow-2xs font-medium"
            >
              <option value="ALL">Tất cả ngành nghề</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* 3. SERVICES DATA GRID (5 DEDICATED COLUMNS) */}
      {/* ========================================= */}
      <div className="flex-1 min-h-0 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between overflow-hidden">
        <div className="overflow-x-auto flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            {/* Header: 5 Columns */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#1e293b]/70 backdrop-blur-xs text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold sticky top-0 z-10">
                <th className="py-2.5 px-4">1. Tên Dịch Vụ & Biểu Tượng</th>
                <th className="py-2.5 px-4">2. Danh Mục (Category)</th>
                <th className="py-2.5 px-4">3. Giá Khởi Điểm</th>
                <th className="py-2.5 px-4">4. Trạng Thái</th>
                <th className="py-2.5 px-4 text-right">5. Thao Tác</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 text-xs text-slate-700 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-500" />
                    <span className="text-xs font-medium">Đang tải danh mục dịch vụ...</span>
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Wrench className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                      Chưa có dịch vụ nào phù hợp
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      Bấm "Thêm Dịch Vụ Mới" hoặc chọn lại bộ lọc
                    </p>
                  </td>
                </tr>
              ) : (
                services.map((service) => {
                  const isActive = service.isActive !== false;

                  return (
                    <tr
                      key={service.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors duration-150 group"
                    >
                      {/* Cột 1: Tên Dịch Vụ & Biểu Tượng */}
                      <td className="py-2 px-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            {getCategoryIcon(service.category?.name, service.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white leading-tight truncate text-xs">
                              {service.name}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {service.description || 'Chưa có mô tả chi tiết cho gói dịch vụ này.'}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                              <span>Ước tính: {service.estimatedDurationMin || 60} phút</span>
                              <span>•</span>
                              <span>Đã phục vụ: {service._count?.orders ?? 0} đơn</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Danh Mục (Category) */}
                      <td className="py-2 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                          <Tag className="w-3 h-3 text-blue-500" />
                          <span>{service.category?.name || 'Chưa phân loại'}</span>
                        </span>
                      </td>

                      {/* Cột 3: Giá Khởi Điểm */}
                      <td className="py-2 px-4">
                        <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                          {formatCurrency(service.basePrice)}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">
                          Đơn vị: /{service.unit || 'lần'}
                        </div>
                      </td>

                      {/* Cột 4: Trạng Thái (Status Badge) */}
                      <td className="py-2 px-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/70 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Đang hoạt động</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>Tạm ngưng</span>
                          </span>
                        )}
                      </td>

                      {/* Cột 5: Thao Tác (Sửa, Bật/Tắt, Xóa) */}
                      <td className="py-2 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-150">
                          {/* Nút Bật / Tắt trạng thái nhanh */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(service)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                            }`}
                            title={isActive ? 'Bấm để Tạm ngưng dịch vụ' : 'Bấm để Kích hoạt dịch vụ'}
                          >
                            {isActive ? (
                              <ToggleRight className="w-4 h-4" />
                            ) : (
                              <ToggleLeft className="w-4 h-4" />
                            )}
                          </button>

                          {/* Nút Sửa (Edit) */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(service)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                            title="Chỉnh sửa thông tin gói dịch vụ"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          {/* Nút Xóa (Custom Glassmorphism Modal) */}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(service)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 dark:hover:text-rose-400 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                            title="Xóa dịch vụ khỏi hệ thống"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ========================================= */}
        {/* 4. PAGINATION FOOTER (CHUẨN VERCEL STYLE) */}
        {/* ========================================= */}
        <div className="p-2 sm:p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#1e293b]/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div>
            Hiển thị{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {services.length}
            </span>{' '}
            trong tổng số{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {pagination.total || services.length}
            </span>{' '}
            gói dịch vụ
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={pagination.page <= 1 || loading}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              className="p-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 transition-colors cursor-pointer shadow-2xs"
              title="Trang trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 font-bold font-mono text-xs shadow-2xs">
              {pagination.page} / {pagination.totalPages || 1}
            </span>

            <button
              disabled={
                pagination.page >= (pagination.totalPages || 1) || loading
              }
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              className="p-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 transition-colors cursor-pointer shadow-2xs"
              title="Trang tiếp"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* 5. ENTERPRISE MODALS (ZERO WINDOW.CONFIRM) */}
      {/* ========================================= */}

      {/* Modal 1: Thêm / Sửa Dịch Vụ */}
      <ServiceFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleSaveService}
        initialData={editingService}
        categories={categories}
        isSubmitting={isSaving}
      />

      {/* Modal 2: Xác Nhận Xóa Dịch Vụ (Thay thế window.confirm) */}
      <DeleteServiceModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        serviceName={deleteTarget?.name}
        isSubmitting={isDeleting}
      />
    </div>
  );
}
