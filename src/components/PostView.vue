<template>
  <div v-if="post && !postStore.loading">
    <h2>{{ post.title }}</h2>
    <p>작성자: {{ post.author }}</p>
    <p>{{ post.content }}</p>
    <!-- 이미지가 있을 경우 표시 -->
    <img v-if="imageUrl" :src="imageUrl" alt="Post image">
    <!-- 수정 페이지로 이동하는 링크 -->
    <router-link :to="`/post/${post.id}/edit`">수정</router-link>
    <!-- 게시글 삭제 버튼 -->
    <button @click="deletePost">삭제</button>
    <!-- 목록 페이지로 돌아가는 링크 -->
    <router-link to="/">목록으로 돌아가기</router-link>
  </div>
  <!-- 로딩 중 메시지 표시 -->
  <p v-else-if="postStore.loading">로딩 중...</p>
  <!-- 에러 메시지 표시 -->
  <p v-else-if="postStore.error" class="error-message">오류 발생: {{ postStore.error }}</p>
  <p v-else>게시글을 찾을 수 없습니다.</p>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePostStore } from '@/stores/postStore';

// Vue Router 인스턴스 생성
const router = useRouter();
const route = useRoute();

// Pinia store 인스턴스 생성
const postStore = usePostStore();

// 현재 게시글을 computed 속성으로 정의
const post = computed(() => postStore.currentPost);

// 컴포넌트가 마운트될 때 게시글 데이터 로드
const imageUrl = computed(() => {
  if (postStore.currentImage && postStore.currentImage.blob) {
    return URL.createObjectURL(postStore.currentImage.blob);
  }
  return null;
});

onMounted(async () => {
  const postId = parseInt(route.params.id);
  await postStore.fetchPost(postId);
  if (post.value && post.value.ImageId) {
    await postStore.fetchImage(post.value.ImageId);
  }
});

// 게시글 삭제 함수
const deletePost = async () => {
  if (post.value) {
    await postStore.deletePost(post.value.id);
    if (!postStore.error) {
      router.push('/');
    }
  }
};

// 컴포넌트가 언마운트될 때 Blob URL 해제
onUnmounted(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
});
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}
</style>