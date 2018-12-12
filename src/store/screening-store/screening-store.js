import axios from '../../global-axios';


export default {
  namespaced: true,
  state: {
    screeningTypes: null,
    screeningCategories: null,
    insurancesUnquieIds: null,
    screeningTestOutcomes: null,
    nationalities: null,
    cities: null,
    residenceLocations: null,
    workLocations: null,
    addScreen: false,
    errors: null,
    documentData: [],
    memberData: null,
    censusScreenings: null,
    screeningRemarks: null,
    screeningDocuments: null,
    pspStatusData: null,
    diseaseID: null,
    screeningTestCategories: null,
    perPage: 20,
    total: 0,
    policiesData: null,
    pspVerbalConcentTypes: null,
    fileTypes: null,
    activePolicies: null,
  },
  mutations: {
    updateLookup(state, screening) {
      state.screeningTypes = screening.types;
      state.screeningCategories = screening['Screening Test Category'];
      state.insurancesUnquieIds = screening['Insurance Unique IDs'];
      state.screeningTestOutcomes = screening['Screening Test Outcome'];
      state.screeningTestCategories = screening['Screening Test Category'];
      state.pspVerbalConcentTypes = screening.pspVerbalConcentTypes;
      state.fileTypes = screening.fileTypes;
    },
    updateNationality(state, nationality) {
      state.nationalities = nationality;
    },
    updateCity(state, city) {
      state.cities = city;
    },
    updateResidenceLocation(state, residenceLocations) {
      state.residenceLocations = residenceLocations;
    },
    updateWorkLocation(state, workLocations) {
      state.workLocations = workLocations;
    },
    updateAddScreening(state, status) {
      state.addScreen = status;
    },
    updateErrors(state, errors) {
      state.errors = errors;
    },
    getDocumentData(state, documentData) {
      state.documentData.push(documentData);
    },
    updateMemberData(state, member) {
      state.memberData = null;
      state.memberData = member;
    },
    updateCensusScreenings(state, screenings) {
      state.censusScreenings = screenings;
    },
    updateScreeningRemarks(state, remarks) {
      state.screeningRemarks = remarks;
    },
    updateScreeningDocuments(state, documents) {
      state.screeningDocuments = documents;
    },
    updatePspStatusData(state, pspData) {
      state.pspStatusData = pspData;
    },
    updatePoliciesData(state, policyData) {
      state.perPage = policyData.per_page;
      state.total = policyData.total;
      state.policiesData = policyData.data;
    },
    updateActivePoliciesData(state, activePolicies) {
      state.activePolicies = activePolicies;
    }
  },
  getters: {},
  actions: {
    getScreeningLookUp({
      commit,
    }, memberID = null) {
      axios.get(`/census/screening/lookup/${memberID}`)
        .then(response => commit('updateLookup', response.data))
        .catch(error => console.log(error));
    },
    getNationalities({
      commit,
    }) {
      axios.get('/census/nationalities')
        .then((response) => {
          commit('updateNationality', response.data);
        })
        .catch(error => console.log(error));
    },
    getCities({
      commit,
    }) {
      axios.get('/census/cities')
        .then((response) => {
          commit('updateCity', response.data);
        })
        .catch(error => console.log(error));
    },
    getResidenceLocations({
      commit,
    }) {
      axios.get('/census/dsc')
        .then((response) => {
          commit('updateResidenceLocation', response.data);
        })
        .catch(error => console.log(error));
    },
    getWorkLocations({
      commit,
    }) {
      axios.get('/census/cities')
        .then((response) => {
          commit('updateWorkLocation', response.data);
        })
        .catch(error => console.log(error));
    },
    addScreeningToMember({
      commit,
    }, screeningData) {
      return axios.post('/census/screening', screeningData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }, ).then(() => {
          commit('updateAddScreening', true);
        }, (error) => {
          commit('updateErrors', error.response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
          // commit('updateErrors', error.response.data);
        });
    },
    uploadScreeningDocument({
      commit,
    }, file) {
      return axios.post('/census/screening/uploadDocumet', file)
        .then((res) => {
          commit('getDocumentData', res.data);
        }, (err) => {
          console.log(err);
        }).catch(err => console.log(err));
    },
    getMemberByID({
      commit,
    }, memberID) {
      return axios.get(`/census/member/${memberID}`)
        .then((res) => {
          commit('updateMemberData', res.data);
        }, err => console.log(err))
        .catch(err => console.log(err));
    },
    getCensusScreening({
      commit,
    }, memberID) {
      axios.get(`/census/screening/${memberID}`)
        .then((res) => {
          commit('updateCensusScreenings', res.data);
        }, err => console.log(err))
        .catch(err => console.log(err));
    },
    getRemarks({
      commit,
    }, diseaseId) {
      return axios.get(`/census/screening/remarks/${diseaseId}`)
        .then((res) => {
          commit('updateScreeningRemarks', res.data);
        })
        .catch(err => console.log(err));
    },
    getDocuments({
      commit,
    }, diseaseId) {
      return axios.get(`/census/screening/${diseaseId}/getDocuments`)
        .then((res) => {
          commit('updateScreeningDocuments', res.data);
        })
        .catch(err => console.log(err));
    },
    getPspData({
      commit,
    }) {
      return axios.get('/census/screening/pspStatus')
        .then((res) => {
          commit('updatePspStatusData', res.data);
        })
        .catch(err => console.log(err));
    },
    addDocument({
      commit,
      state,
    }, file) {
      return axios.post(`/census/screening/${state.diseaseID}/addDocumet`, file, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {}, (err) => {
          commit('updateErrors', err.response);
        });
    },
    addRemark({
      commit,
      state,
    }, remark) {
      return axios.post(`/census/screening/remarks/${state.diseaseID}`, remark)
        .then(() => {}, (err) => {
          commit('updateErrors', err.response);
        });
    },
    updatePspStatus({
      commit,
    }, pspStatusData) {
      return axios.post(`/census/screening/${pspStatusData.screeningId}/pspStatus`, pspStatusData)
        .then(() => {}, (err) => {
          commit('updateErrors', err.response.data);
        });
    },
    searchExistPolicy({
      commit,
    }, query) {
      axios.get(`/census/search_existing_policy${query}`)
        .then((res) => {
          commit('updatePoliciesData', res.data);
        }, err => console.log(err))
        .catch(err => console.log(err));
    },
    getActivePolicies({
      commit
    }, memberID) {
      return axios.get(`/census/screening/${memberID}/activePolicies`)
        .then((res) => {
          commit('updateActivePoliciesData', res.data);
        }, err => commit('updateErrors', err.response.data))
        .catch(err => console.log(err));
    },
    enrollToActivePolicy({
      commit
    }, policyObject) {
      return axios.post(`/census/screening/${policyObject.screeningID}/enroll`, policyObject.payer)
        .then((res) => {
          console.log(res.data);
        }, err => commit('updateErrors', err.response.data))
        .catch(err => console.log(err));
    }
  },
};