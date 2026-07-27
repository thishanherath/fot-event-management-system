import api from "../api/axios";

export const registerForEvent = (eventId) => {
    return api.post(`/registrations/event/${eventId}`);
};

export const getMyRegistrations = () => {
    return api.get("/registrations/my");
};

export const getEventParticipants = (eventId) => {
    return api.get(`/registrations/event/${eventId}`);
};

export const cancelRegistration = (registrationId) => {
    return api.delete(`/registrations/${registrationId}`);
};
