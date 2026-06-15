import instance from '@/helper/instance';

class RequirementService {
  async getRecentRequiremnts() {
    return instance.get('requirement/recent-requirements').then(res => res.data?.data || res.data);
  }

  async createRequirement(params) {
    return instance.post('/requirement/create', params).then(res => res.data?.data || res.data);
  }
  async getMyRequirements(page = 1, limit = 10) {
    return instance
      .get('/requirement/my-requirements', {
        params: {
          page,
          limit,
        },
      })
      .then(res => res.data?.data || res.data);
  }
  async getApprovedPendingRequirements() {
    return instance.get('/requirement/approved-pending').then(res => res.data?.data || res.data);
  }

  async getCompletedApprovedRequirements() {
    return instance.get('/requirement/completed-approved').then(res => res.data?.data || res.data);
  }
  async getRequirementById(id) {
    return instance
      .get(`/requirement/get-requirement/${id}`)
      .then(res => res.data?.data || res.data);
  }
  async getRequirementAward() {
    // for  buyer
    return instance.get('/requirement/requirement-awarded').then(res => res.data?.data || res.data);
  }
  async getDealAwarded() {
    // for saller
    return instance.get('/requirement/deal-awarded').then(res => res.data?.data || res.data);
  }
  async getRequirementId(productId) {
    // for saller
    return instance
      .get('/requirement/get-requirement-id/' + productId)
      .then(res => res.data?.data || res.data);
  }
  async submitDealSurvey(data) {
    return instance.post('/deal-survey', data).then(res => res.data?.data || res.data);
  }
  async getDealSurvey(dealId) {
    return instance.get(`/deal-survey/${dealId}`).then(res => res.data?.data || res.data);
  }
}
export default new RequirementService();
