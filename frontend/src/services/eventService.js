import api from "../api/axios";

export const getAllEvents = () => {
    return api.get("/events");
};

export const getEventById = (id) => {
    return api.get(`/events/${id}`);
};

export const createEvent = (eventData) => {
    return api.post("/events", eventData);
};

export const updateEvent = (id, eventData) => {
    return api.put(`/events/${id}`, eventData);
};

export const deleteEventById = (id) => {
    return api.delete(`/events/${id}`);
};

export const approveEvent = (id) => {
    return api.put(`/events/${id}/approve`);
};

export const getMyEvents = () => {
    return api.get("/events/my");
};

export const getDashboardStats = () => {
    return api.get("/events/dashboard/stats");
};
