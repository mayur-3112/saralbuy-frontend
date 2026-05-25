import instance from '@/helper/instance';

class BucketService {
  async uploadFile(formData) {
    return instance.post('/bucket', formData).then(res => res.data?.data || res.data);
  }
}

export default new BucketService();
