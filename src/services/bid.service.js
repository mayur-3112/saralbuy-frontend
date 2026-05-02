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
}
export default new BidService();
