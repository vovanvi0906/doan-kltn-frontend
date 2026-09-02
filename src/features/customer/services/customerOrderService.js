import apiClient from '../../../services/api/client';

export const customerOrderService = {
  /**
   * Lấy danh sách dịch vụ khả dụng
   */
  async getServices() {
    try {
      const res = await apiClient.get('/services');
      return res.data || res;
    } catch (err) {
      console.warn('Fallback default services:', err.message);
      return [];
    }
  },

  /**
   * Tạo đơn hàng dịch vụ mới (Khách hàng)
   * @param {Object} data - { serviceId, pickupLat, pickupLng, pickupAddress, note, description }
   */
  async createOrder(data) {
    const res = await apiClient.post('/orders', data);
    return res.data || res;
  },

  /**
   * Lấy danh sách đơn hàng của khách hàng hiện tại
   */
  async getMyOrders() {
    const res = await apiClient.get('/orders');
    return res.data || res;
  },

  /**
   * Lấy chi tiết đơn hàng
   */
  async getOrderById(orderId) {
    const res = await apiClient.get(`/orders/${orderId}`);
    return res.data || res;
  },
};

export default customerOrderService;
