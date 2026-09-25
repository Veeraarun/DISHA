import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const analyzeSpecification = async (text) => {
  const response = await api.post("/api/v1/analyze", {
    text,
  });

  return response.data;
};

export const getAnalysis = async (analysisId) => {
  const response = await api.get(
    `/api/v1/analysis/${analysisId}`
  );

  return response.data;
};

export async function analyzePdf(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/api/v1/analyze/pdf",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export default api;