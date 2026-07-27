import api from "../api/axios";


// Register user
export const registerUser = (userData) => {
    return api.post("/auth/register",userData);
};

// Login user
export const loginUser = (loginData) => {
    return api.post("/auth/login", loginData);
};