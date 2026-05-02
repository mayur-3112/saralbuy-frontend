import instance from '@/helper/instance';

class AuthService {
  async sendOtp(pNo) {
    return instance
      .post('/user/send-otp', {
        pNo,
      })
      .then(res => res.data?.data || res.data);
  }
  async verifyOtp(pNo, otp, sessionId) {
    return instance
      .post('/user/verify-otp', {
        pNo,
        otp,
        sessionId,
      })
      .then(res => res.data?.data || res.data);
  }
  async userProfile() {
    return instance.get('/user/profile').then(res => res.data?.data || res.data);
  }
}
export default new AuthService();
