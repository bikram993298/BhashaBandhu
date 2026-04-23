import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers(language = "") {
  const response = await axiosInstance.get(`/users${language ? `?language=${encodeURIComponent(language)}` : ""}`);
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

export async function updateProfile(formData) {
  const response = await axiosInstance.put("/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function getRecommendedUsersByLanguage(language) {
  const params = language ? { language } : {};
  const response = await axiosInstance.get("/users", { params });
  return response.data;
}

// Story API functions
export async function createStory(storyData) {
  const response = await axiosInstance.post("/stories", storyData, {
    headers: storyData instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return response.data;
}

export async function getStoryFeed() {
  const response = await axiosInstance.get("/stories/feed");
  return response.data;
}

export async function getUserStories() {
  const response = await axiosInstance.get("/stories/user/stories");
  return response.data;
}

export async function viewStory(storyId) {
  const response = await axiosInstance.get(`/stories/${storyId}`);
  return response.data;
}

export async function getStoryViewers(storyId) {
  const response = await axiosInstance.get(`/stories/${storyId}/viewers`);
  return response.data;
}

export async function reactToStory(storyId, emoji) {
  const response = await axiosInstance.post(`/stories/${storyId}/react`, { emoji });
  return response.data;
}

export async function deleteStory(storyId) {
  const response = await axiosInstance.delete(`/stories/${storyId}`);
  return response.data;
}

export default axiosInstance;
