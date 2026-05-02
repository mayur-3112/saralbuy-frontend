import instance from '@/helper/instance';
class CategoryService {
  async getCategories() {
    return instance.get('/category/get-category').then(res => res.data?.data || res.data);
  }
  async getCategoriesById(categoryId) {
    return instance
      .get(`/category/get-category/${categoryId}`)
      .then(res => res.data?.data || res.data);
  }
}
export default new CategoryService();
