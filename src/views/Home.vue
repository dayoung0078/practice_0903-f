<template>
    <div class="home">
      <h1>CRUD 게시판</h1>
      <PostList />
    </div>
  </template>
  
  <script>
  import PostList from '@/components/PostList.vue'
  
  export default {
    name: 'HomePage',
    components: {
      PostList
    }
  }
  </script>