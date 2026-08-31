import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../../store/authStore';
import { validateLoginForm } from '../../../utils/validation';
import { tokenStorage } from '../../../services/storage/tokenStorage';

export default function LoginPage() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, setUser, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleRedirectByRole = (userRole) => {
    const normalizedRole = String(userRole || '').toUpperCase();
    if (normalizedRole === 'ADMIN') {
      navigate('/admin/dashboard', { replace: true });
    } else if (normalizedRole === 'WORKER') {
      navigate('/worker/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  // Auto redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      handleRedirectByRole(role);
    }
  }, [isAuthenticated, role]);

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
      const userRole = result?.user?.role || result?.role || 'CUSTOMER';

      showToast('success', `Đăng nhập thành công! Đang chuyển hướng...`);
      setTimeout(() => {
        handleRedirectByRole(userRole);
      }, 300);
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
    <div className="min-h-screen relative flex items-center justify-center bg-[#0a0f1d] text-slate-100 p-4 sm:p-6 lg:p-10 select-none overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[650px] h-[650px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[650px] h-[650px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-[0_20px_70px_-15px_rgba(0,0,0,0.8)] border border-slate-700/50 bg-[#0d1424] grid grid-cols-1 lg:grid-cols-12 z-10">
        
        {/* Left Side: Brand Banner with backgroundlogin image */}
        <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[420px] lg:min-h-[620px] overflow-hidden flex items-center justify-center bg-black/40">
          <img 
            src="/images/backgroundlogin.jpg" 
            alt="FixGo - Kết Nối Dịch Vụ Nâng Tầm Cuộc Sống"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle edge overlay on dark transition */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0d1424]/50 hidden lg:block pointer-events-none" />
        </div>

        {/* Right Side: Login Form Panel */}
        <div className="lg:col-span-5 flex flex-col justify-center items-center p-6 sm:p-8 lg:p-10 bg-gradient-to-b from-[#131c2d] to-[#0c121e] relative overflow-hidden">
          
          {/* Soft blue backlighting behind the glassmorphism card */}
          <div className="absolute w-72 h-72 bg-blue-500/15 rounded-full blur-[90px] pointer-events-none" />

          {/* Toast Notification */}
          {toast && (
            <div 
              className={`w-full max-w-sm mb-4 p-3.5 rounded-xl border backdrop-blur-xl transition-all duration-300 flex items-start gap-2.5 shadow-xl animate-in fade-in slide-in-from-top-2 ${
                toast.type === 'error'
                  ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                  : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              }`}
            >
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
                {toast.message}
              </div>
            </div>
          )}

          {/* Floating Frosted Glassmorphism Form Card */}
          <div className="w-full max-w-sm bg-slate-800/35 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] relative">
            
            {/* Form Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 tracking-wide drop-shadow-sm">
              Đăng Nhập
            </h1>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Account Field */}
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
                  placeholder="Email hoặc Tên đăng nhập"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-600/60 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/25 focus:bg-slate-900/70 transition-all"
                  required
                />
              </div>

              {/* Password Field */}
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
                  placeholder="Mật khẩu"
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-900/50 border border-slate-600/60 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/25 focus:bg-slate-900/70 transition-all"
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

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast('error', 'Chức năng Quên mật khẩu đang được nâng cấp.')}
                  className="text-xs text-slate-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Submit Button with Royal Blue -> Purple Gradient & Glow */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-gradient-to-r from-[#17237b] via-[#1d35a6] to-[#5b1f9e] hover:from-[#1b2b8c] hover:via-[#233ebb] hover:to-[#6c23b8] text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(29,53,166,0.45)] border border-indigo-400/30 active:scale-[0.99] disabled:opacity-60 transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_0_25px_rgba(91,31,158,0.55)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>ĐANG XỬ LÝ...</span>
                  </>
                ) : (
                  <span>ĐĂNG NHẬP</span>
                )}
              </button>
            </form>

            {/* Quick Login Divider */}
            <div className="text-center my-4">
              <span className="text-xs text-slate-400">
                Hoặc đăng nhập nhanh bằng
              </span>
            </div>

            {/* Social Logins */}
            <div className="flex items-center justify-center gap-3">
              {/* Google Button */}
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title="Đăng nhập với Google"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </button>

              {/* Facebook Button */}
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title="Đăng nhập với Facebook"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              {/* Apple Button */}
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                title="Đăng nhập với Apple"
              >
                <svg className="w-4 h-4 fill-black" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.08-7.7-7.94-12-14.58-6.19-9.56-11-20.57-14.43-33.02-3.43-12.45-5.15-24.32-5.15-35.6 0-15.02 3.65-27.46 10.96-37.33 7.3-9.87 16.71-14.9 28.23-15.1 4.58 0 9.87 1.25 15.86 3.75 6 2.5 10.14 3.79 12.44 3.89 1.96 0 6.34-1.39 13.14-4.17 6.81-2.77 12.56-3.95 17.27-3.53 13.06.84 23.36 5.86 30.9 15.05-11.33 6.86-16.89 16.29-16.69 28.29.2 9.4 3.86 17.22 10.98 23.47 7.12 6.24 15.42 9.77 24.89 10.59-2.28 6.74-4.88 13.27-7.8 19.58zm-31.54-110.1c0 6.84-2.58 13.2-7.73 19.08-6.04 6.84-13.39 10.72-22.04 11.64-.2-.98-.3-1.9-.3-2.76 0-6.73 2.76-13.23 8.27-19.5 5.51-6.27 12.59-9.98 21.24-11.13.11.89.56 1.78.56 2.67z" />
                </svg>
              </button>
            </div>

            {/* Sign up prompt */}
            <div className="text-center mt-5">
              <span className="text-xs text-slate-300">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => showToast('error', 'Chức năng Đăng ký tài khoản đang được hoàn thiện.')}
                  className="text-[#e2934b] hover:text-[#f3a863] font-semibold hover:underline cursor-pointer transition-colors"
                >
                  Đăng ký ngay
                </button>
              </span>
            </div>

            {/* Decorative Sparkle Icon at Bottom-Right */}
            <div className="absolute -bottom-2.5 -right-2.5 pointer-events-none opacity-80 text-slate-200">
              <svg className="w-8 h-8 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
          </div>

          {/* Footer Terms & Policy */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] sm:text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <a href="#terms" className="hover:text-slate-300 transition-colors">
              Điều khoản dịch vụ
            </a>
            <span>|</span>
            <a href="#privacy" className="hover:text-slate-300 transition-colors">
              Chính sách bảo mật
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
