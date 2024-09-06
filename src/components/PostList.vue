<template>
  <div>
    <h1>게시글 목록</h1>
    <ul v-if="!postStore.loading">
      <li v-for="post in postStore.posts" :key="post.id">
        <router-link :to="{ name: 'PostView', params: { id: post.id } }">
          {{ post.title }}
        </router-link>
      </li>
    </ul>
    <p v-else>로딩 중...</p>
    <p v-if="postStore.error">{{ postStore.error }}</p>
    <router-link to="/post/create">새 게시글 작성</router-link>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePostStore } from '@/stores/postStore';

const postStore = usePostStore();

onMounted(async () => {
  await postStore.fetchPosts();
});
</script>