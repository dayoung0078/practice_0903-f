import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export default {
  getAllPosts() {
    return axios.get(`${API_URL}/post`).then(response => response.data);
  },

  getPostById(id) {
    return axios.get(`${API_URL}/post/${id}`).then(response => response.data);
  },

  createPost(post) {
    return axios.post(`${API_URL}/post`, post).then(response => response.data);
  },

  updatePost(id, post) {
    return axios.put(`${API_URL}/post/${id}`, post).then(response => response.data);
  },

  deletePost(id) {
    return axios.delete(`${API_URL}/post/${id}`);
  },
};