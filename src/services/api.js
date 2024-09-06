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

   // 새로 추가된 이미지 관련 API
   uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_URL}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => response.data);
  },

  getImage(id) {
    return axios.get(`${API_URL}/image/${id}`, {
      responseType: 'blob'
    }).then(response => response.data);
  },

  updateImage(id, file) {
    const formData = new FormData();
    formData.append('file', file);
    return axios.put(`${API_URL}/image/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => response.data);
  },

  deleteImage(id) {
    return axios.delete(`${API_URL}/image/${id}`);
  }
};
