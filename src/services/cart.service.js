import instance from '@/helper/instance';

class CartService {
  async addToCart(productId) {
    return instance.post('/cart/add', { productId }).then(res => res.data);
  }
  async getCart() {
    return instance.get('/cart/get-cart').then(res => res.data?.data || res.data);
  }
  async removeCart(cartId, productId) {
    return instance
      .post(`/cart/remove-cart/${cartId}/${productId}`, {})
      .then(res => res.data?.data || res.data);
  }
}
export default new CartService();
