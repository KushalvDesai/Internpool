// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Include credentials for CORS
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Auth
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async signup(data) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Student routes
  async getStudentProfile() {
    return this.request('/student/profile');
  },

  async getStudentInternships() {
    return this.request('/student/internships');
  },

  async createInternship(data) {
    return this.request('/student/internship', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getStudentReports() {
    return this.request('/student/reports');
  },

  async createReport(data) {
    return this.request('/student/report', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async submitWeeklyReport(reportId, data) {
    return this.request(`/student/report/${reportId}/weekly`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getCompanies() {
    return this.request('/student/companies');
  },

  async getFaculty(studentId) {
    return this.request(`/student/faculty/${studentId}`);
  },

  // Faculty routes
  async getFacultyStudents() {
    return this.request('/faculty/students');
  },

  async getFacultyStudentsByType(type) {
    return this.request(`/faculty/students/internshipType/${type}`);
  },

  async getFacultyStudent(studentId) {
    return this.request(`/faculty/students/${studentId}`);
  },

  async getFacultyStudentReports(studentId) {
    return this.request(`/faculty/reports/${studentId}`);
  },

  async gradeReport(reportId, weekNumber, grade, remarks) {
    return this.request(`/faculty/report/grade/${reportId}`, {
      method: 'PUT',
      body: JSON.stringify({ weekNumber, grade, remarks }),
    });
  },

  async getFacultyCompanies() {
    return this.request('/faculty/companies');
  },

  // Admin routes
  async assignFacultyBatch(facultyId, batch) {
    return this.request(`/admin/faculty/${facultyId}/assign`, {
      method: 'PUT',
      body: JSON.stringify({ batch }),
    });
  },

  async getAllStudents() {
    return this.request('/admin/students');
  },

  async getStudentsByType(type) {
    return this.request(`/admin/students/internshipType/${type}`);
  },

  async getAllFaculty() {
    return this.request('/admin/faculty');
  },

  async getAdminCompanies() {
    return this.request('/admin/companies');
  },

  async getAllInternships() {
    return this.request('/admin/internships');
  },

  // Company routes
  async getCompany(id) {
    return this.request(`/api/company/${id}`);
  },

  async getCompanies() {
    return this.request('/api/company');
  },

  async createCompany(data) {
    return this.request('/api/company', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCompany(id, data) {
    return this.request(`/api/company/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCompany(id) {
    return this.request(`/api/company/${id}`, {
      method: 'DELETE',
    });
  },
};

