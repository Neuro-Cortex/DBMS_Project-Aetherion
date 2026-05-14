// src/services/api.ts

// ============================================
// API CONFIGURATION
// ============================================

const BASE_URL: string =
  import.meta.env.VITE_API_URL || "https://api.medicare.com/v1";

const API_TIMEOUT = 15000;

// ============================================
// TYPES
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  message: string;
  statusCode: number;
  timestamp?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface RequestOptions {
  headers?: HeadersInit;
  timeout?: number;
  skipAuth?: boolean;
}

// ============================================
// HELPERS
// ============================================

const getAuthToken = (): string | null => {
  try {
    const raw = localStorage.getItem("medicare_user");
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed?.token ?? null;
  } catch {
    return null;
  }
};

// Get user from localStorage
export const getCurrentUser = (): any => {
  try {
    const raw = localStorage.getItem("medicare_user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// Save user to localStorage
export const saveUser = (user: any): void => {
  localStorage.setItem("medicare_user", JSON.stringify(user));
};

// Clear user from localStorage
export const clearUser = (): void => {
  localStorage.removeItem("medicare_user");
  localStorage.removeItem("medicare_token");
};

// Simulate network delay (for development)
export const simulateDelay = (ms: number = 800): Promise<void> => {
  if (import.meta.env.PROD && ms > 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) =>
    setTimeout(resolve, ms + Math.random() * 300)
  );
};

// Handle API errors
export const handleApiError = (error: ApiError): void => {
  console.error("API Error:", error);
};

// ============================================
// API CLIENT CLASS
// ============================================

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor(baseUrl: string, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = timeout;
  }

  private getHeaders(options?: RequestOptions): HeadersInit {
    const token = !options?.skipAuth ? getAuthToken() : null;

    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    };
  }

  private async handleResponse<T>(
    response: Response,
    endpoint: string
  ): Promise<ApiResponse<T>> {
    const statusCode = response.status;

    if (response.ok) {
      let data: T;
      const contentType = response.headers.get("content-type");
      
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      return {
        data,
        success: true,
        message: "Success",
        statusCode,
        timestamp: new Date().toISOString(),
      };
    }

    let message = "An unexpected error occurred";
    let errors: Record<string, string[]> | undefined;

    try {
      const err = await response.json();
      message = err?.message || err?.error || message;
      errors = err?.errors;
    } catch {
      try {
        const text = await response.text();
        if (text) message = text;
      } catch {
        // ignore
      }
    }

    if (statusCode === 401) {
      clearUser();
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
      message = "Session expired. Please login again.";
    }

    if (statusCode === 403) {
      message = "You don't have permission to access this resource.";
    }

    if (statusCode === 404) {
      message = "Resource not found.";
    }

    if (statusCode === 429) {
      message = "Too many requests. Please try again later.";
    }

    if (statusCode >= 500) {
      message = "Server error. Please try again later.";
    }

    return {
      data: null,
      success: false,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw error;
    }
  }

  async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = this.getHeaders(options);
      const timeout = options?.timeout || this.defaultTimeout;

      const fetchOptions: RequestInit = {
        method,
        headers,
        ...(data && { body: JSON.stringify(data) }),
      };

      const response = await this.fetchWithTimeout(url, fetchOptions, timeout);
      return this.handleResponse<T>(response, endpoint);
    } catch (error: any) {
      console.error(`API ${method} Error [${endpoint}]:`, error);

      let message = "Network error. Please check your connection.";
      
      if (error.message === "Request timeout") {
        message = "Request timeout. Please try again.";
      } else if (error.message?.includes("Failed to fetch")) {
        message = "Unable to connect to server. Please check your internet connection.";
      }

      return {
        data: null,
        success: false,
        message,
        statusCode: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url = `${endpoint}?${queryString}`;
      }
    }
    
    return this.request<T>("GET", url, undefined, options);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", endpoint, data, options);
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", endpoint, data, options);
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", endpoint, data, options);
  }

  async delete<T>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", endpoint, undefined, options);
  }

  async upload<T>(
    endpoint: string,
    file: File,
    fieldName: string = "file",
    additionalData?: Record<string, any>,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);
      
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
      }

      const token = !options?.skipAuth ? getAuthToken() : null;
      
      const fetchOptions: RequestInit = {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options?.headers || {}),
        },
        body: formData,
      };

      const timeout = options?.timeout || this.defaultTimeout;
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}${endpoint}`,
        fetchOptions,
        timeout
      );
      
      return this.handleResponse<T>(response, endpoint);
    } catch (error: any) {
      return {
        data: null,
        success: false,
        message: error?.message || "Upload failed",
        statusCode: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

// ============================================
// CREATE API INSTANCE
// ============================================

export const api = new ApiClient(BASE_URL, API_TIMEOUT);

// ============================================
// API SERVICE (for useAppointment hook)
// ============================================

export const apiService = {
  // Appointment Methods
  getAppointments: async (userId: string) => {
    const response = await api.get(`/appointments/user/${userId}`);
    return response.data;
  },
  
  getAppointmentById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },
  
  getDoctorAppointments: async (doctorId: string) => {
    const response = await api.get(`/appointments/doctor/${doctorId}`);
    return response.data;
  },
  
  createAppointment: async (data: any) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },
  
  updateAppointment: async (id: string, data: any) => {
    const response = await api.put(`/appointments/${id}`, data);
    return response.data;
  },
  
  cancelAppointment: async (id: string, reason?: string) => {
    const response = await api.post(`/appointments/${id}/cancel`, { reason });
    return response.data;
  },
  
  getAppointmentDetails: async (id: string) => {
    const response = await api.get(`/appointments/${id}/details`);
    return response.data;
  },
  
  searchAppointments: async (query: string, filters?: any) => {
    const response = await api.get('/appointments/search', { 
      params: { query, ...filters } 
    });
    return response.data;
  },
  
  filterAppointments: async (filters: any) => {
    const response = await api.post('/appointments/filter', filters);
    return response.data;
  },
  
  getAppointmentStatistics: async (userId?: string) => {
    const response = await api.get('/appointments/statistics', { 
      params: { userId } 
    });
    return response.data;
  },
  
  getAvailableTimeSlots: async (doctorId: string, date: string) => {
    const response = await api.get(`/doctors/${doctorId}/available-slots`, { 
      params: { date } 
    });
    return response.data;
  },

  // Doctor Methods
  getDoctors: async (filters?: any) => {
    const response = await api.get('/doctors', { params: filters });
    return response.data;
  },
  
  getDoctorById: async (id: string) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  // Hospital Methods
  getHospitals: async (filters?: any) => {
    const response = await api.get('/hospitals', { params: filters });
    return response.data;
  },
  
  getHospitalById: async (id: string) => {
    const response = await api.get(`/hospitals/${id}`);
    return response.data;
  },

  // Emergency Methods
  getEmergencyServices: async () => {
    const response = await api.get('/emergency/services');
    return response.data;
  },
  
  createEmergencyRequest: async (data: any) => {
    const response = await api.post('/emergency/request', data);
    return response.data;
  },

  // Auth Methods
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  updateProfile: async (updates: any) => {
    const response = await api.put('/auth/profile', updates);
    return response.data;
  },
};

// ============================================
// MOCK API (for development)
// ============================================

export const mockApi = {
  async get<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    await simulateDelay(500);
    console.log(`[MOCK API] GET ${endpoint}`, data);
    return {
      data: null as unknown as T,
      success: true,
      message: "Mock success",
      statusCode: 200,
    };
  },
  
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    await simulateDelay(500);
    console.log(`[MOCK API] POST ${endpoint}`, data);
    return {
      data: null as unknown as T,
      success: true,
      message: "Mock success",
      statusCode: 200,
    };
  },
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default api;