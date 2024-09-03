<template>
    <div>
      <h2>게시글 수정</h2>
      <form @submit.prevent="updatePost" v-if="post">
        <div>
          <label for="title">제목:</label>
          <input id="title" v-model="post.title" required>
        </div>
        <div>
          <label for="author">글쓴이:</label>
          <input id="author" v-model="post.author" required>
        </div>
        <div>
          <label for="content">내용:</label>
          <textarea id="content" v-model="post.content" required></textarea>
        </div>
        <button type="submit">게시글 수정</button>
      </form>
    </div>
  </template>
  
  <script>
  import api from '@/services/api';
  
  export default {
    name: 'PostEdit',
    data() {
      return {
        post: null
      };
    },
    created() {
      this.fetchPost();
    },
    methods: {
      async fetchPost() {
        try {
          const response = await api.getPost(this.$route.params.id);
          this.post = response.data;
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      },
      async updatePost() {
        try {
          await api.updatePost(this.$route.params.id, this.post);
          this.$router.push('/');
        } catch (error) {
          console.error('Error updating post:', error);
        }
      }
    }
  };
  </script>