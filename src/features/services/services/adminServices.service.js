import apiClient from '../../../services/api/client';

export const adminServicesService = {
  /**
   * Lấy danh sách toàn bộ dịch vụ (có phân trang, tìm kiếm, lọc isActive và categoryId)
   * @param {{ isActive?: string, categoryId?: string, search?: string, page?: number, limit?: number }} params
   */
  async getServices({ isActive, categoryId, search, page = 1, limit = 10 } = {}) {
    const params = { page, limit };

    if (isActive !== undefined && isActive !== 'ALL' && isActive !== '') {
      params.isActive = isActive;
    }
    if (categoryId && categoryId !== 'ALL') {
      params.categoryId = categoryId;
    }
    if (search && search.trim()) {
      params.search = search.trim();
    }

    try {
      const response = await apiClient.get('/admin/services', { params });
      return response.data || response;
    } catch (err) {
      console.warn('[adminServicesService] Fallback mock services:', err.message);

      const mockServices = [
        {
          id: 'srv-001',
          name: 'Sửa chập điện âm tường',
          description: 'Khắc phục sự cố chập cháy, nhảy CB tự động, rò rỉ điện âm tường khẩn cấp.',
          basePrice: '150000',
          unit: 'lần',
          estimatedDurationMin: 45,
          isActive: true,
          category: { id: 'cat-001', name: 'Điện dân dụng' },
          _count: { orders: 124, workerServices: 18 },
        },
        {
          id: 'srv-002',
          name: 'Vệ sinh & bảo dưỡng máy lạnh',
          description: 'Vệ sinh dàn nóng, dàn lạnh, châm ga bổ sung và kiểm tra áp suất làm lạnh.',
          basePrice: '200000',
          unit: 'bộ',
          estimatedDurationMin: 60,
          isActive: true,
          category: { id: 'cat-002', name: 'Điện lạnh' },
          _count: { orders: 256, workerServices: 32 },
        },
        {
          id: 'srv-003',
          name: 'Thông tắc bồn cầu & cống ngầm',
          description: 'Sử dụng máy lò xo chuyên dụng thông tắc không đục phá sàn gạch.',
          basePrice: '250000',
          unit: 'lần',
          estimatedDurationMin: 60,
          isActive: true,
          category: { id: 'cat-003', name: 'Đường ống nước' },
          _count: { orders: 89, workerServices: 14 },
        },
        {
          id: 'srv-004',
          name: 'Mở khóa cửa khẩn cấp 24/7',
          description: 'Mở khóa cửa tay gạt, khóa bấm, khóa vân tay điện tử khi quên chìa.',
          basePrice: '180000',
          unit: 'lần',
          estimatedDurationMin: 30,
          isActive: true,
          category: { id: 'cat-004', name: 'Khóa cửa & Két sắt' },
          _count: { orders: 67, workerServices: 9 },
        },
        {
          id: 'srv-005',
          name: 'Dọn dẹp nhà theo giờ',
          description: 'Dọn dẹp phòng khách, bếp, nhà vệ sinh, giặt ủi và sắp xếp đồ dùng gia đình.',
          basePrice: '90000',
          unit: 'giờ',
          estimatedDurationMin: 120,
          isActive: true,
          category: { id: 'cat-005', name: 'Vệ sinh nhà ở' },
          _count: { orders: 310, workerServices: 45 },
        },
        {
          id: 'srv-006',
          name: 'Sơn dặm vá tường nhà',
          description: 'Xử lý bong tróc, ẩm mốc tường và sơn dặm màu đồng bộ nội thất.',
          basePrice: '300000',
          unit: 'm²',
          estimatedDurationMin: 180,
          isActive: false,
          category: { id: 'cat-001', name: 'Điện dân dụng' },
          _count: { orders: 12, workerServices: 4 },
        },
      ];

      let filtered = mockServices;
      if (isActive !== undefined && isActive !== 'ALL' && isActive !== '') {
        const boolActive = isActive === 'true';
        filtered = filtered.filter((s) => s.isActive === boolActive);
      }
      if (categoryId && categoryId !== 'ALL') {
        filtered = filtered.filter((s) => s.category?.id === categoryId);
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.name.toLowerCase().includes(s) ||
            item.description?.toLowerCase().includes(s) ||
            item.category?.name.toLowerCase().includes(s)
        );
      }

      return {
        data: filtered,
        pagination: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit) || 1,
        },
      };
    }
  },

  /**
   * Lấy danh sách danh mục dịch vụ
   */
  async getCategories() {
    try {
      const response = await apiClient.get('/admin/service-categories');
      return response.data || response;
    } catch {
      return [
        { id: 'cat-001', name: 'Điện dân dụng' },
        { id: 'cat-002', name: 'Điện lạnh' },
        { id: 'cat-003', name: 'Đường ống nước' },
        { id: 'cat-004', name: 'Khóa cửa & Két sắt' },
        { id: 'cat-005', name: 'Vệ sinh nhà ở' },
      ];
    }
  },

  /**
   * Tạo dịch vụ mới
   * @param {{ name: string, description: string, basePrice: number, categoryId: string, unit?: string, estimatedDurationMin?: number, isActive?: boolean }} data
   */
  async createService(data) {
    const res = await apiClient.post('/admin/services', data);
    return res.data || res;
  },

  /**
   * Cập nhật dịch vụ
   * @param {string} id
   * @param {object} data
   */
  async updateService(id, data) {
    const res = await apiClient.patch(`/admin/services/${id}`, data);
    return res.data || res;
  },

  /**
   * Bật/Tắt nhanh trạng thái hoạt động của dịch vụ
   * @param {string} id
   */
  async toggleServiceStatus(id) {
    const res = await apiClient.patch(`/admin/services/${id}/toggle`);
    return res.data || res;
  },

  /**
   * Xóa hoặc tạm ngưng dịch vụ
   * @param {string} id
   */
  async deleteService(id) {
    const res = await apiClient.delete(`/admin/services/${id}`);
    return res.data || res;
  },
};

export default adminServicesService;
