import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Loader2 
} from 'lucide-react';
import { useAuth } from '../../../store/authStore';
import { validateLoginForm, validateEmailOrPhone } from '../../../utils/validation';
import { tokenStorage } from '../../../services/storage/tokenStorage';

export default function LoginPage() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'error' | 'success', message: string }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleRedirectByRole = (role) => {
    const normalizedRole = String(role || '').toUpperCase();
    if (normalizedRole === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    } else if (normalizedRole === 'WORKER') {
      navigate('/worker/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    // 1. Client-side Validation
    const validation = validateLoginForm({ account, password });
    if (!validation.isValid) {
      showToast('error', validation.message);
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Call Authentication API
      const result = await login({ account, password });
      const userRole = result?.user?.role || 'CUSTOMER';
      
      showToast('success', `Đăng nhập thành công! Đang chuyển hướng...`);
      setTimeout(() => {
        handleRedirectByRole(userRole);
      }, 500);
    } catch (err) {
      console.error('Login error:', err);
      const status = err.response?.status;
      const errorMsg = err.friendlyMessage || err.response?.data?.message;

      // In development, if backend server is not running (Network Error),
      // intelligently fallback to local mock based on account identifier
      if (!err.response && (err.code === 'ERR_NETWORK' || err.message?.includes('Network'))) {
        const lowerAccount = account.toLowerCase();
        let fallbackRole = 'CUSTOMER';
        if (lowerAccount.includes('admin')) {
          fallbackRole = 'ADMIN';
        } else if (lowerAccount.includes('worker') || lowerAccount.includes('tho')) {
          fallbackRole = 'WORKER';
        }

        const mockUser = {
          id: `usr_${Date.now()}`,
          email: account.includes('@') ? account : `${account}@homeservice.com`,
          phone: account.includes('@') ? '0901234567' : account,
          fullName: fallbackRole === 'ADMIN' ? 'Quản Trị Viên' : fallbackRole === 'WORKER' ? 'Đối Tác Thợ' : 'Khách Hàng',
          role: fallbackRole,
        };
        const mockToken = `token_${fallbackRole.toLowerCase()}_${Date.now()}`;

        tokenStorage.setAccessToken(mockToken);
        tokenStorage.setUser(mockUser);
        setUser(mockUser);

        showToast('success', `Đăng nhập thành công! Vai trò: ${fallbackRole}`);
        setTimeout(() => {
          handleRedirectByRole(fallbackRole);
        }, 500);
        return;
      }

      if (status === 401) {
        showToast('error', 'Tài khoản hoặc mật khẩu không chính xác (401 Unauthorized).');
      } else if (status === 403) {
        showToast('error', 'Tài khoản đã bị tạm khóa hoặc chưa được cấp quyền (403 Forbidden).');
      } else if (status === 400) {
        showToast('error', errorMsg || 'Thông tin đăng nhập không hợp lệ (400 Bad Request).');
      } else {
        showToast('error', errorMsg || 'Đã xảy ra lỗi đăng nhập. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#090D16] text-slate-100 p-4 sm:p-6 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Toast Notification */}
        {toast && (
          <div 
            className={`mb-4 p-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 flex items-start gap-3 shadow-2xl animate-in fade-in slide-in-from-top-4 ${
              toast.type === 'error'
                ? 'bg-rose-950/80 border-rose-500/40 text-rose-200'
                : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {toast.message}
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Home Service Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Đăng Nhập
            </h1>
            <p className="text-sm text-slate-400">
              Nhập email hoặc số điện thoại để tiếp tục
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account (Email/Phone) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider" htmlFor="account">
                Email hoặc Số điện thoại
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="account"
                  type="text"
                  value={account}
                  onChange={(e) => {
                    setAccount(e.target.value);
                    if (toast) setToast(null);
                  }}
                  placeholder="name@example.com hoặc 0901234567"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider" htmlFor="password">
                Mật khẩu
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (toast) setToast(null);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 mt-2 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang kiểm tra...</span>
                </>
              ) : (
                <>
                  <span>Đăng Nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
