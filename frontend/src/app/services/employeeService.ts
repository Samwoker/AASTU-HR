import makeCall from "../API";
import apiRoutes from "../API/apiRoutes";

const employeeService = {
  onboardEmployee: async (data: any) => {
    const response = await makeCall({
      route: apiRoutes.onboarding,
      method: "POST",
      body: data,
      isSecureRoute: true,
    });
    return response;
  },

  getProfile: async (id?: string) => {
    const response = await makeCall({
      route: id ? `${apiRoutes.employees}/${id}` : `${apiRoutes.employees}/me`,
      method: "GET",
      isSecureRoute: true,
    });
    return response;
  },

  getSuggestions: async (type: "departments" | "jobTitles" | "jobLevels" | "fieldsOfStudy" | "institutions" | "employees" | "managers", query: string) => {
    const isEmployee = type === "employees";
    const isManager = type === "managers";
    const response = await makeCall({
      route: isEmployee
        ? `${apiRoutes.assignManagers.search}?query=${query}`
        : isManager
          ? `${apiRoutes.assignManagers.existingManagers}?query=${query}`
          : `${apiRoutes.suggestions[type]}?q=${query}`,
      method: "GET",
      isSecureRoute: true,
    });
    return response;
  },

  updatePersonalDetails: async (id: string, data: any) => {
    return await makeCall({
      route: apiRoutes.updatePersonal(id),
      method: "PATCH",
      body: data,
      isSecureRoute: true,
    });
  },

  updateFinancialDetails: async (id: string, data: any) => {
    return await makeCall({
      route: apiRoutes.updateFinancial(id),
      method: "PATCH",
      body: data,
      isSecureRoute: true,
    });
  },

  updateEmploymentDetails: async (id: string, data: any) => {
    return await makeCall({
      route: apiRoutes.updateEmployment(id),
      method: "PATCH",
      body: data,
      isSecureRoute: true,
    });
  },

  updateAddresses: async (id: string, addresses: any[]) => {
    return await makeCall({
      route: apiRoutes.updateAddresses(id),
      method: "PATCH",
      body: { addresses },
      isSecureRoute: true,
    });
  },

  updatePhones: async (id: string, phones: any[]) => {
    return await makeCall({
      route: apiRoutes.updatePhones(id),
      method: "PATCH",
      body: { phones },
      isSecureRoute: true,
    });
  },

  updateEducation: async (id: string, education: any[]) => {
    return await makeCall({
      route: apiRoutes.updateEducation(id),
      method: "PATCH",
      body: { education },
      isSecureRoute: true,
    });
  },

  updateWorkExperience: async (id: string, workExperience: any[]) => {
    return await makeCall({
      route: apiRoutes.updateWorkExperience(id),
      method: "PATCH",
      body: { workExperience },
      isSecureRoute: true,
    });
  },

  updateCertifications: async (id: string, certifications: any[]) => {
    return await makeCall({
      route: apiRoutes.updateCertifications(id),
      method: "PATCH",
      body: { certifications },
      isSecureRoute: true,
    });
  },

  updateDocuments: async (id: string, documents: any[]) => {
    return await makeCall({
      route: apiRoutes.updateDocuments(id),
      method: "PATCH",
      body: { documents },
      isSecureRoute: true,
    });
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await makeCall({
      route: apiRoutes.upload,
      method: "POST",
      body: formData,
      isSecureRoute: true,
    });
    return response;
  },
};

export default employeeService;
