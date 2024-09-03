<template>
    <div>
      <h2>새 게시글 작성</h2>
      <form @submit.prevent="createPost">
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
        <button type="submit">게시글 작성</button>
      </form>
    </div>
  </template>
  
  <script>
  import api from '@/services/api';
  
  export default {
    name: 'PostCreate',
    data() {
      return {
        post: {
          title: '',
          author:'',
          content: ''
        }
      };
    },
    methods: {
      async createPost() {
        try {
          await api.createPost(this.post);
          this.$router.push('/');
        } catch (error) {
          console.error('Error creating post:', error);
        }
      }
    }
  };
  </script>