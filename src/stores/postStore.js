import { defineStore } from 'pinia'
import axios from 'axios'  // axios를 직접 import

// 'post'라는 이름으로 store를 정의
export const usePostStore = defineStore('post', {
  // 상태(state) 정의
  state: () => ({
    posts: [],          // 모든 게시글 목록을 저장하는 배열
    currentPost: null,  // 현재 선택된 게시글 객체
    loading: false,     // API 요청 중 로딩 상태를 나타내는 불리언 값
    error: null,        // 에러 발생 시 에러 메시지를 저장하는 문자열
    currentImage: null  // 현재 선택된 이미지 정보를 저장하는 객체
  }),
  
  // 액션(actions) 정의 - 상태를 변경하는 비동기 메서드들
  actions: {
    // 모든 게시글 가져오기
    async fetchPosts() {
      this.loading = true
      try {
        const response = await axios.get('/api/post')  // '/api' 접두사 추가
        this.posts = response.data
      } catch (error) {
        this.error = error.response?.data?.message || '게시글을 불러오는데 실패했습니다.'
      } finally {
        this.loading = false
      }
    },

    // 특정 ID의 게시글 가져오기
    async fetchPost(id) {
      this.loading = true
      try {
        const response = await axios.get(`/api/post/${id}`)  
        this.currentPost = response.data
      } catch (error) {
        this.error = error.response?.data?.message || '게시글을 불러오는데 실패했습니다.'
      } finally {
        this.loading = false
      }
    },

    // 새 게시글 생성
    async createPost(postData, imageFile) {
        this.loading = true
        try {
          let imageId = null;
          if (imageFile) {
            const imageResponse = await this.uploadImage(imageFile);
            imageId = imageResponse.id;
          }
          const postWithImage = { ...postData, imageId: imageId };
          const response = await axios.post('/api/post', postWithImage);
          this.posts.push(response.data);
          return response.data;
        } catch (error) {
          this.error = error.response?.data?.message || '게시글 생성에 실패했습니다.';
        } finally {
          this.loading = false
        }
      },

    // 게시글 수정
    async updatePost(id, postData, imageFile) {
        this.loading = true
        try {
          let imageId = postData.imageId;
          if (imageFile) {
            if (imageId) {
              await this.deleteImage(imageId);
            }
            const imageResponse = await this.uploadImage(imageFile);
            imageId = imageResponse.id;
          }
          const postWithImage = { ...postData, imageId: imageId };
          const response = await axios.put(`/api/post/${id}`, postWithImage);
          const updatedPost = response.data;
          const index = this.posts.findIndex(post => post.id === id);
          if (index !== -1) {
            this.posts[index] = updatedPost;
          }
          this.currentPost = updatedPost;
          return updatedPost;
        } catch (error) {
          this.error = error.response?.data?.message || '게시글 수정에 실패했습니다.';
        } finally {
          this.loading = false
        }
      },

    // 게시글 삭제
    async deletePost(id) {
        this.loading = true
        try {
          const post = await this.fetchPost(id);
          if (post.imageId) {
            await this.deleteImage(post.imageId);
          }
          await axios.delete(`/api/post/${id}`);
          this.posts = this.posts.filter(post => post.id !== id);
        } catch (error) {
          this.error = error.response?.data?.message || '게시글 삭제에 실패했습니다.';
        } finally {
          this.loading = false
        }
      },

    // 이미지 업로드
    async uploadImage(file) {
      this.loading = true
      try {
        const formData = new FormData()
        formData.append('file', file)
        const response = await axios.post('/api/image', formData, {  // '/api' 접두사 추가
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        if (this.currentPost) {
          this.currentPost.ImageId = response.data.id
        }
        this.currentImage = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || '이미지 업로드에 실패했습니다.'
      } finally {
        this.loading = false
      }
    },

    // 이미지 가져오기
    async fetchImage(id) {
      this.loading = true
      try {
        const response = await axios.get(`/api/image/${id}`, { responseType: 'blob' })  // '/api' 접두사 추가
        const imageBlob = response.data
        this.currentImage = { id, blob: imageBlob }
      } catch (error) {
        this.error = error.response?.data?.message || '이미지를 불러오는데 실패했습니다.'
      } finally {
        this.loading = false
      }
    },

    // 이미지 삭제
    async deleteImage(id) {
      this.loading = true
      try {
        await axios.delete(`/api/image/${id}`)  // '/api' 접두사 추가
        if (this.currentPost && this.currentPost.ImageId === id) {
          this.currentPost.ImageId = null
        }
        this.currentImage = null
      } catch (error) {
        this.error = error.response?.data?.message || '이미지 삭제에 실패했습니다.'
      } finally {
        this.loading = false
      }
    }
  }
});