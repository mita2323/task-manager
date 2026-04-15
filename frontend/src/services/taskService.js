import axios from "axios";
const API_URL = "http://localhost:5000/api/tasks";

export const getTasks = (filter = 'all') => 
  axios.get(`${API_URL}?filter=${filter}`).then(res => res.data);

export const createTask = (data) => 
  axios.post(API_URL, data).then(res => res.data);

export const updateTask = (id, data) => 
  axios.put(`${API_URL}/${id}`, data).then(res => res.data);

export const deleteTask = (id) => 
  axios.delete(`${API_URL}/${id}`).then(() => null);