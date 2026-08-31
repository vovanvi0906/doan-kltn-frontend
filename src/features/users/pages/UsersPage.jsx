import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../store/authStore';
import { userService } from '../services/user.service';
import UserModal from '../components/UserModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Mail,
  Phone,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';
import { formatDate } from '../../../utils/formatDate';

export default function UsersPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  // State Management (Hiển thị đúng 10 người/trang vừa khít màn hình)
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [selectedRoleTab, setSelectedRoleTab] = useState('ALL'); // ALL, CUSTOMER, WORKER, ADMIN
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals & Action States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers({
        role: selectedRoleTab === 'ALL' ? undefined : selectedRoleTab,
        status: selectedStatus === 'ALL' ? undefined : selectedStatus,
        search: searchTerm,
        page: pagination.page,
        limit: pagination.limit,
      });

      if (res?.data) {
        setUsers(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      showToast('error', 'Không thể tải danh sách người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRoleTab, selectedStatus, pagination.page]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchUsers();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  // Create or Update Submit Handler
  const handleSaveUser = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingUser) {
        // Update
        await userService.updateUser(editingUser.id, formData);
        showToast(
          'success',
          `Đã cập nhật thông tin "${formData.fullName}" thành công.`
        );
      } else {
        // Create
        await userService.createUser(formData);
        showToast(
          'success',
          `Đã tạo tài khoản "${formData.fullName}" thành công.`
        );
      }
      setIsModalOpen(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Save user failed:', err);
      showToast(
        'error',
        err.response?.data?.message ||
          err.message ||
          'Lỗi khi lưu thông tin người dùng.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handler with Constraints
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    // Ràng buộc bảo vệ
    if (deleteTarget.id === currentUser?.id || deleteTarget.email === currentUser?.email) {
      showToast('error', 'Bạn không thể tự xóa tài khoản của chính mình.');
      setDeleteTarget(null);
      return;
    }

    if (deleteTarget.role === 'ADMIN') {
      showToast('error', 'Không thể xóa tài khoản Quản trị viên (Admin).');
      setDeleteTarget(null);
      return;
    }

    try {
      setIsDeleting(true);
      await userService.deleteUser(deleteTarget.id);
      showToast(
        'success',
        `Đã xóa tài khoản "${deleteTarget.fullName}" thành công.`
      );
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      console.error('Delete user failed:', err);
      showToast(
        'error',
        err.response?.data?.message || err.message || 'Lỗi khi xóa người dùng.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick Worker Approve / Reject
  const handleApproveWorker = async (workerId, name) => {
    try {
      await userService.approveWorker(workerId);
      showToast('success', `Đã phê duyệt hồ sơ thợ "${name}" thành công.`);
      fetchUsers();
    } catch (err) {
      showToast('error', 'Lỗi khi phê duyệt hồ sơ.');
    }
  };

  const handleRejectWorker = async (workerId, name) => {
    try {
      await userService.rejectWorker(workerId);
      showToast('success', `Đã từ chối hồ sơ thợ "${name}".`);
      fetchUsers();
    } catch (err) {
      showToast('error', 'Lỗi khi từ chối hồ sơ.');
    }
  };

  return (
    <div className="h-full flex flex-col justify-between space-y-2 select-none transition-colors duration-200 overflow-hidden">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 p-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 flex items-start gap-2 shadow-2xl animate-in slide-in-from-top-4 ${
            toast.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/90 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              : 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs font-semibold pr-2">{toast.message}</div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-1.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
        <div className="space-y-0.5">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Quản Lý Danh Sách Người Dùng
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            Quản lý tài khoản Khách hàng (Customer), Đối tác Thợ (Worker) và Quản trị viên (Admin).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer disabled:opacity-50"
            title="Làm mới danh sách"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600 dark:text-blue-400' : ''}`}
            />
          </button>

          <button
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Thêm Người Dùng</span>
          </button>
        </div>
      </div>

      {/* Filter Controls & Role Tabs */}
      <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50/70 dark:bg-[#1e293b]/40 border border-slate-200/80 dark:border-slate-800/80 space-y-2 shrink-0">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 border-b border-slate-200/80 dark:border-slate-800/80 pb-1.5 overflow-x-auto">
          <button
            onClick={() => setSelectedRoleTab('ALL')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedRoleTab === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            Tất Cả ({pagination.total || users.length})
          </button>

          <button
            onClick={() => setSelectedRoleTab('CUSTOMER')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedRoleTab === 'CUSTOMER'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            Khách Hàng (Customer)
          </button>

          <button
            onClick={() => setSelectedRoleTab('WORKER')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedRoleTab === 'WORKER'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            Đối Tác Thợ (Worker)
          </button>

          <button
            onClick={() => setSelectedRoleTab('ADMIN')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedRoleTab === 'ADMIN'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
            }`}
          >
            Quản Trị Viên (Admin)
          </button>
        </div>

        {/* Search and Status Dropdown */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Search className="w-3 h-3" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tên, email, SĐT..."
              className="w-full pl-7 pr-3 py-1 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-[11px] cursor-pointer"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Status Select */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Filter className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 py-1 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer w-full sm:w-auto shadow-2xs"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động (ACTIVE)</option>
              <option value="BLOCKED">Đang khóa (BLOCKED)</option>
              <option value="PENDING">Thợ chờ duyệt (PENDING)</option>
              <option value="APPROVED">Thợ đã duyệt (APPROVED)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table Card */}
      <div className="flex-1 min-h-0 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200/90 dark:border-slate-800/90 shadow-2xs flex flex-col justify-between overflow-hidden">
        <div className="overflow-x-auto flex-1 min-h-0 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#1e293b]/70 text-[10.5px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold sticky top-0 z-10">
                <th className="py-1.5 px-3 sm:px-4">Người Dùng</th>
                <th className="py-1.5 px-3 sm:px-4">Liên Hệ</th>
                <th className="py-1.5 px-3 sm:px-4">Vai Trò</th>
                <th className="py-1.5 px-3 sm:px-4">Trạng Thái</th>
                <th className="py-1.5 px-3 sm:px-4">Ngày Tạo</th>
                <th className="py-1.5 px-3 sm:px-4 text-right">Thao Tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs text-slate-700 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs">Đang tải dữ liệu người dùng...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <Users className="w-7 h-7 mx-auto mb-1.5 opacity-30" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                      Không tìm thấy người dùng nào
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((item) => {
                  const isWorker = item.role === 'WORKER';
                  const isAdmin = item.role === 'ADMIN';
                  const isSelf = item.id === currentUser?.id || item.email === currentUser?.email;
                  const canDelete = !isAdmin && !isSelf;

                  const isPendingWorker =
                    isWorker && item.approvalStatus === 'PENDING';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group"
                    >
                      {/* User info & avatar */}
                      <td className="py-1.5 px-3 sm:px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-[10px] uppercase shadow-xs shrink-0">
                            {item.fullName ? item.fullName.charAt(0) : 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-white leading-tight truncate text-xs">
                              {item.fullName || 'Chưa đặt tên'}
                              {isSelf && (
                                <span className="ml-1.5 text-[9.5px] font-normal text-blue-600 dark:text-blue-400">
                                  (Bạn)
                                </span>
                              )}
                            </div>
                            <div className="text-[9.5px] text-slate-400 dark:text-slate-500 truncate">
                              ID: {item.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact details */}
                      <td className="py-1.5 px-3 sm:px-4 space-y-0.5">
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 text-xs truncate">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.email || 'N/A'}</span>
                        </div>
                        {item.phone && (
                          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px]">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{item.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Role */}
                      <td className="py-1.5 px-3 sm:px-4">
                        {isWorker ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                            <Briefcase className="w-2.5 h-2.5" />
                            <span>THỢ</span>
                          </span>
                        ) : isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            <span>ADMIN</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                            <Users className="w-2.5 h-2.5" />
                            <span>KHÁCH HÀNG</span>
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-1.5 px-3 sm:px-4">
                        {item.status === 'BLOCKED' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-[10px] font-semibold">
                            <XCircle className="w-2.5 h-2.5" />
                            <span>Tạm khóa</span>
                          </span>
                        ) : isPendingWorker ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-[10px] font-semibold animate-pulse">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Chờ duyệt</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>Hoạt động</span>
                          </span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="py-1.5 px-3 sm:px-4 text-[10.5px] text-slate-500 dark:text-slate-400">
                        {item.createdAt ? formatDate(item.createdAt) : 'Mới tạo'}
                      </td>

                      {/* Action buttons */}
                      <td className="py-1.5 px-3 sm:px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Worker Approval Shortcut */}
                          {isPendingWorker && (
                            <>
                              <button
                                onClick={() =>
                                  handleApproveWorker(item.id, item.fullName)
                                }
                                className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer"
                                title="Duyệt hồ sơ thợ"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() =>
                                  handleRejectWorker(item.id, item.fullName)
                                }
                                className="p-1 rounded-md bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                                title="Từ chối hồ sơ"
                              >
                                <XCircle className="w-3 h-3" />
                              </button>
                            </>
                          )}

                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              setEditingUser(item);
                              setIsModalOpen(true);
                            }}
                            className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            title="Chỉnh sửa thông tin"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>

                          {/* Delete Button (Khóa xóa Admin hoặc chính mình) */}
                          <button
                            disabled={!canDelete}
                            onClick={() => {
                              if (!canDelete) {
                                if (isSelf) {
                                  showToast('error', 'Bạn không thể tự xóa tài khoản của chính mình.');
                                } else if (isAdmin) {
                                  showToast('error', 'Không thể xóa tài khoản Quản trị viên (Admin).');
                                }
                                return;
                              }
                              setDeleteTarget(item);
                            }}
                            className={`p-1 rounded-md transition-colors ${
                              canDelete
                                ? 'bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 cursor-pointer'
                                : 'opacity-25 cursor-not-allowed text-slate-400 dark:text-slate-600'
                            }`}
                            title={
                              isSelf
                                ? 'Không thể tự xóa tài khoản của chính mình'
                                : isAdmin
                                ? 'Không thể xóa tài khoản Quản trị viên (Admin)'
                                : 'Xóa người dùng'
                            }
                          >
                            <Trash2 className="w-3 h-3" />
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

        {/* Pagination Footer */}
        <div className="p-2 sm:p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div>
            Hiển thị{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {users.length}
            </span>{' '}
            trong tổng số{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {pagination.total || users.length}
            </span>{' '}
            người dùng
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={pagination.page <= 1 || loading}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              className="p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-2.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 font-bold text-xs shadow-2xs">
              Trang {pagination.page} / {pagination.totalPages || 1}
            </span>

            <button
              disabled={
                pagination.page >= (pagination.totalPages || 1) || loading
              }
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              className="p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* User Create / Edit Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSaveUser}
        initialData={editingUser}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        userName={deleteTarget?.fullName}
        isSubmitting={isDeleting}
      />
    </div>
  );
}
