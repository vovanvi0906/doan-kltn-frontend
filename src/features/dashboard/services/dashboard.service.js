import apiClient from '../../../services/api/client';

/**
 * Mock Data fallback used when backend stats endpoint is not yet available
 */
const MOCK_DASHBOARD_STATS = {
  totalCustomers: 128,
  totalWorkers: 45,
  pendingWorkers: 7,
  totalOrders: 312,
  totalRevenue: 86500000,
  recentActivities: [
    {
      id: 'act_1',
      type: 'WORKER_REGISTER',
      title: 'Thợ mới đăng ký hồ sơ',
      description: 'Nguyễn Văn Hùng vừa gửi hồ sơ thợ điện - chờ phê duyệt.',
      time: '10 phút trước',
      status: 'PENDING',
    },
    {
      id: 'act_2',
      type: 'ORDER_COMPLETED',
      title: 'Đơn hàng hoàn tất',
      description: 'Đơn sửa ống nước #ORD-9821 hoàn thành thành công.',
      time: '25 phút trước',
      status: 'COMPLETED',
    },
    {
      id: 'act_3',
      type: 'CUSTOMER_NEW',
      title: 'Khách hàng mới',
      description: 'Trần Thị Mai (mai.tran@gmail.com) đã tạo tài khoản.',
      time: '1 giờ trước',
      status: 'ACTIVE',
    },
    {
      id: 'act_4',
      type: 'WORKER_APPROVED',
      title: 'Phê duyệt hồ sơ thợ',
      description: 'Hồ sơ thợ Lê Văn Toàn đã được duyệt thành công.',
      time: '3 giờ trước',
      status: 'APPROVED',
    },
  ],
  serviceDistribution: [
    { name: 'Sửa chữa điện nước', count: 120, percentage: 38, color: '#3b82f6' },
    { name: 'Điện lạnh - Máy lạnh', count: 85, percentage: 27, color: '#10b981' },
    { name: 'Sửa khóa & Cửa cuốn', count: 48, percentage: 15, color: '#f59e0b' },
    { name: 'Vệ sinh & Bảo trì gia đình', count: 59, percentage: 20, color: '#8b5cf6' },
  ],
};

export const dashboardService = {
  /**
   * Get Admin Dashboard Statistics
   * Will call backend /admin/stats if ready, otherwise smartly falls back to mock data
   */
  async getDashboardStats() {
    try {
      // 1. Attempt calling real backend API
      const response = await apiClient.get('/admin/stats');
      return response.data;
    } catch (err) {
      // 2. If endpoint not implemented (404/500/Network), use fallback mock
      console.warn('[dashboardService] API /admin/stats not found or offline. Using fallback mock data.', err.message);
      
      // Smart adapter: also check workers list if available
      try {
        const workerRes = await apiClient.get('/admin/workers');
        if (workerRes?.data && Array.isArray(workerRes.data)) {
          const workers = workerRes.data;
          const pendingCount = workers.filter(w => w.approvalStatus === 'PENDING').length;
          return {
            ...MOCK_DASHBOARD_STATS,
            totalWorkers: workers.length,
            pendingWorkers: pendingCount,
          };
        }
      } catch {
        // Ignore and return default mock
      }

      return MOCK_DASHBOARD_STATS;
    }
  },
};
