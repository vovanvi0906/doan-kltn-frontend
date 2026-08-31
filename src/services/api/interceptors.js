import { tokenStorage } from '../storage/tokenStorage';

/**
 * Configure Axios request and response interceptors
 * @param {import('axios').AxiosInstance} axiosInstance 
 */
export const setupInterceptors = (axiosInstance) => {
  // Request Interceptor: Attach Authorization Bearer token if present
  axiosInstance.interceptors.request.use(
    (config) => {
      // Exclude public authentication endpoints if necessary, but standard Bearer header doesn't hurt
      const token = tokenStorage.getAccessToken();
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: Format error payloads and catch unauthorized sessions
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        
        // Formulate friendly error messages
        let friendlyMessage = data?.message || data?.error || 'Đã xảy ra lỗi trong quá trình xử lý';
        if (status === 400) {
          friendlyMessage = data?.message || 'Dữ liệu yêu cầu không hợp lệ (400)';
        } else if (status === 401) {
          friendlyMessage = data?.message || 'Tài khoản hoặc mật khẩu không chính xác (401)';
        } else if (status === 403) {
          friendlyMessage = data?.message || 'Tài khoản đã bị khóa hoặc không có quyền truy cập (403)';
        } else if (status >= 500) {
          friendlyMessage = 'Lỗi máy chủ hệ thống (500). Vui lòng thử lại sau.';
        }

        error.friendlyMessage = friendlyMessage;
      } else if (error.request) {
        error.friendlyMessage = 'Không thể kết nối đến máy chủ API (http://localhost:3000/api). Vui lòng kiểm tra backend server.';
      } else {
        error.friendlyMessage = error.message || 'Lỗi không xác định';
      }

      return Promise.reject(error);
    }
  );
};
