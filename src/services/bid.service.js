import instance from '@/helper/instance';

class BidService {
  async getThreeLatestBids() {
    return instance
      .get('/bid/get-three-latest-bid-and-draft')
      .then(res => res.data?.data || res.data);
  }
  async bidOverViewbyId(bidId) {
    return instance.get(`/bid/bid-overview/${bidId}`).then(res => res.data?.data || res.data);
  }
  async updateUserBidDets(id, dataObj) {
    return instance
      .put(`/bid/update-bid-user-dets/${id}`, dataObj)
      .then(res => res.data?.data || res.data);
  }
  async createBid(buyerId, productId, dataObj) {
    return instance
      .post(`/bid/create/${buyerId}/${productId}`, dataObj, {
        withCredentials: true,
      })
      .then(res => res.data?.data || res.data);
  }
  async getAllBids(limit = 10, page = 1, search = '', sortBy = 'desc') {
    return instance
      .get('/bid/get-all-bid', {
        params: {
          limit,
          page,
          search,
          sortBy,
        },
      })
      .then(res => res.data?.data || res.data);
  }
  async getBidById(id, limit = 10, page = 1, search = '', sortBy = 'desc') {
    return instance
      .get(`/bid/bid-details/${id}`, {
        withCredentials: true,
        params: {
          limit,
          page,
          search,
          sortBy,
        },
      })
      .then(res => res.data?.data || res.data);
  }
  async getbidByProductId(productId) {
    return instance
      .get(`/bid/get-bid-by-productId/${productId}`)
      .then(res => res.data?.data || res.data);
  }
  async deleteBid(productId) {
    return instance
      .delete(`/bid/delete-bid/${productId}`, {
        withCredentials: true,
      })
      .then(res => res.data?.data || res.data);
  }
  // base on productId  and sellerId
  async getBidByProductIdAndSellerId(productId, sellerId) {
    return instance
      .get(`/bid/get-bid-details/${productId}/${sellerId}`)
      .then(res => res.data?.data || res.data);
  }
  async getBidStats(productId) {
    return instance
      .get(`/bid/get-bid-stats/${productId}`)
      .then(res => res.data?.data || res.data);
  }
  async updateQuoteStatus(bidId, statusObj) {
    return instance
      .put(`/bid/update-quote-status/${bidId}`, statusObj)
      .then(res => res.data?.data || res.data);
  }
}
export default new BidService();
