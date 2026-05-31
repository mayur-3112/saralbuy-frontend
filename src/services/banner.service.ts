import instance from '@/helper/instance';

class BannerService {
  getBanners() {
    let payload = {
      page: 1,
      limit: 100,
    };
    return instance
      .get('/admin/banner', {
        params: payload,
      })
      .then(res => res.data?.data || res.data);
  }
}

export default new BannerService();
