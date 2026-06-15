import instance from '@/helper/instance';

class ProductService {
  async addProduct(categoryId, subCategoryId, productObj) {
    return instance
      .post(`/product/add-product/${categoryId}/${subCategoryId}/`, productObj)
      .then(res => res.data?.data || res.data);
  }
  async addMultipleProducts(payload) {
    return instance
      .post(`/product/create-multiple`, payload)
      .then(res => res.data?.data || res.data);
  }
  async getTrendingCategory() {
    return instance.get('/product/get-trending-category').then(res => res.data?.data || res.data);
  }
  async getHomeCards() {
    return instance.get('/product/get-home-products').then(res => res.data?.data || res.data);
  }
  async getSeachProduct(productName, categoryId) {
    return instance
      .get('/product/get-product/' + productName, {
        params: {
          categoryId,
        },
      })
      .then(res => res.data?.data || res.data);
  }
  // { category?: string; subCategoryId?: string; min_budget?: number; max_budget?: number; sort?: string }
  async getProductByTitle(title, page = 1, limit = 10, filters = {}) {
    return instance.get('/product/get-products-by-title/search', {
      params: {
        title,
        page,
        limit,
        ...filters,
      },
    });
  }
  async getProductById(productId) {
    return instance
      .get('/product/get-product-by-id/' + productId)
      .then(res => res.data?.data || res.data);
  }
  async getDrafts(page = 1, limit = 10) {
    return instance
      .get('/product/get-draft-products', {
        params: {
          page,
          limit,
        },
      })
      .then(res => res.data?.data || res.data);
  }
  async deleteDraft(productId) {
    return instance
      .delete(`/product/delete-draft-product/${productId}`)
      .then(res => res.data?.data || res.data);
  }
  async getDraftById(productId) {
    return instance
      .get('/product/get-draft-product/' + productId)
      .then(res => res.data?.data || res.data);
  }
  async updateDrafts(payload) {
    return instance.patch(`/product/updatedraft`, payload).then(res => res.data?.data || res.data);
  }
  async saveAsDraft(payload) {
    return instance.put(`/product/save_as_draft`, payload).then(res => res.data?.data || res.data);
  }
  async getLiveStats() {
    return instance.get('/product/live-stats').then(res => res.data?.data || res.data);
  }
}
export default new ProductService();
