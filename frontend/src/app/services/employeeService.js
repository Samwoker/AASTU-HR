import api from './api';

const employeeService = {
  // Step 1: Create Employee
  createEmployee: async (data) => {
    const response = await api.post('/employees/create', data);
    return response.data;
  },

  // Step 2: Create Employment
  createEmployment: async (data) => {
    const response = await api.post('/employments', data);
    return response.data;
  },

  // Step 3: Create User
  createUser: async (data) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  // Orchestrator for the full onboarding flow
  onboardEmployee: async (formData) => {
    try {
      // 1. Create Employee
      const employeeData = {
        company_id: 1, // Hardcoded for now as per Postman example, or derive from context
        employee_id: formData.employeeId || `EMP_${Date.now()}`, // Generate or use provided ID
        full_name: formData.fullName,
        gender: formData.gender,
        // Add other fields as needed by backend
      };
      const employeeResponse = await employeeService.createEmployee(employeeData);
      const employeeId = employeeResponse.employee_id || employeeData.employee_id;

      // 2. Create Employment
      // Assuming first work experience or current role info is used for employment
      // For now, using some defaults or data from form if available
      const employmentData = {
        company_id: 1,
        employee_id: employeeId,
        employment_type: "Full Time", // Default or from form
        start_date: new Date().toISOString().split('T')[0], // Today
        gross_salary: 0, // Placeholder
        // Add other fields
      };
      await employeeService.createEmployment(employmentData);

      // 3. Create User (if email is provided)
      // We need an email for the user account.
      // The wizard collects contact info, check if email is there.
      // If not, maybe skip or use a placeholder?
      // The Postman example uses "modular@test.com".
      // Let's assume we can get email from contact info or generate one.
      // But wait, the wizard doesn't seem to have an email field in the flat structure shown in StepDocuments/Wizard?
      // Let's check StepContactInfo.
      
      // If email is available:
      // const userData = {
      //   company_id: 1,
      //   employee_id: employeeId,
      //   email: formData.email,
      //   role_id: 3 // Employee role
      // };
      // await employeeService.createUser(userData);

      return { success: true, employeeId };
    } catch (error) {
      console.error("Onboarding failed:", error);
      throw error;
    }
  },
  // Get Employee by ID
  getEmployee: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  // Update Employee
  updateEmployee: async (id, data) => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },
};

export default employeeService;
