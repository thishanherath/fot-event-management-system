import api from "../api/axios";

export const getAllStudents = () => {
    return api.get("/admin/students");
};

export const getAllUsers = () => {
    return api.get("/admin/users");
};

export const registerStudentByAdmin = (studentData) => {
    return api.post("/admin/students", studentData);
};

export const deleteStudent = (id) => {
    return api.delete(`/admin/students/${id}`);
};
