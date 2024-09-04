<template>
    <div v-if="post">
      <h2>{{ post.title }}</h2>
      <p>{{ post.content }}</p>
      <router-link :to="`/post/${post.id}/edit`">수정</router-link>
      <button @click="deletePost">삭제</button>
      <router-link to="/">목록으로 돌아가기</router-link>
    </div>
  </template>
  
  <script>
  import api from '@/services/api';
  
  export default {
    name: 'PostView',
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
          this.post = await api.getPostById(this.$route.params.id);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      },
      async deletePost() {
        try {
          await api.deletePost(this.$route.params.id);
          this.$router.push('/');
        } catch (error) {
          console.error('Error deleting post:', error);
        }
      }
    }
  };
  </script>