// src/store/index.js
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    user: null,
    token: null,
    school: null
  }),
  actions: {
    setUser(userData) {
      this.user = userData
    },
    setToken(token) {
      this.token = token
    },
    setSchool(schoolData) {
      this.school = schoolData
    },
    logout() {
      this.user = null
      this.token = null
      this.school = null
    }
  }
})
