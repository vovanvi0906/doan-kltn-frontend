import apiClient from '../../../services/api/client';

export const dashboardService = {
  /**
   * Lấy số liệu thống kê tổng quan hệ thống Admin thời gian thực từ Backend & Database
   * @param {'today' | 'week' | 'month'} timeframe
   */
  async getDashboardStats(timeframe = 'month') {
    try {
      const response = await apiClient.get('/admin/dashboard/overview', {
        params: { timeframe },
      });
      return response.data || response;
    } catch (err) {
      console.warn('[dashboardService] Failed to load dashboard stats from backend:', err.message);
      return {
        totalCustomers: 0,
        totalWorkers: 0,
        pendingWorkers: 0,
        onlineWorkers: 0,
        totalOrders: 0,
        totalOrdersInPeriod: 0,
        completedOrders: 0,
        activeOrders: 0,
        totalRevenue: 0,
        serviceDistribution: [],
        recentActivities: [],
        timeframe,
      };
    }
  },
};

export default dashboardService;
