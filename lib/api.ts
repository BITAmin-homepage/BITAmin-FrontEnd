// API 설정
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://bitamin.ai.kr" 
  : ""

// API 엔드포인트
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  },
  MEMBERS: {
    LIST: `${API_BASE_URL}/api/members`,
    DETAIL: (id: string) => `${API_BASE_URL}/api/members/${id}`,
    STATUS: (id: string) => `${API_BASE_URL}/api/members/status/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/members/update/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/members/${id}`,
    PENDING: `${API_BASE_URL}/api/members/pending`,
  },
  PROJECTS: {
    LIST: `${API_BASE_URL}/api/projects`,
    CREATE: `${API_BASE_URL}/api/projects`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/projects/${id}`,
    UPLOAD: (id: string) => `${API_BASE_URL}/api/projects/${id}/upload`,
    THUMBNAIL: (id: string) => `${API_BASE_URL}/api/projects/${id}/thumbnail`,
    PPT: (id: string) => `${API_BASE_URL}/api/projects/${id}/ppt`,
  },
} as const
