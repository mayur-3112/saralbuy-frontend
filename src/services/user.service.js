import instance from '@/helper/instance';

class UserService {
  async updateProfile(obj) {
    return instance
      .post('/user/update-profile', obj, {
        withCredentials: true,
      })
      .then(res => res.data?.data || res.data);
  }
  async logout() {
    return instance
      .get('/user/logout', {
        withCredentials: true,
      })
      .then(res => res.data?.data || res.data);
  }
}

export default new UserService();
