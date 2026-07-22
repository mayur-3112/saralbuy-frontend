import instance from '@/helper/instance';

class UserService {
  async updateProfile(obj) {
    return instance.post('/user/update-profile', obj).then(res => res.data?.data || res.data);
  }
  async getUserProfile(userId) {
    return instance
      .get(`/user/user-profile`, {
        params: { userId },
      })
      .then(res => res.data?.data || res.data);
  }
  async profile() {
    return instance.get(`/user/profile`).then(res => res.data?.data || res.data);
  }
  async logout() {
    return instance.get('/user/logout').then(res => res.data?.data || res.data);
  }
  async submitVerification(formData) {
    return instance
      .post('/user/submit-verification', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(res => res.data?.data || res.data);
  }
  async getVerificationStatus() {
    return instance
      .get('/user/verification-status')
      .then(res => res.data?.data || res.data);
  }
}

export default new UserService();
