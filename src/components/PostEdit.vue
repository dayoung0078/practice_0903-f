<template>
  <div>
    <h2>게시글 수정</h2>
    <!-- post가 존재할 때만 폼을 표시 -->
    <form @submit.prevent="updatePost" v-if="post">
      <!-- 제목 입력 필드 -->
      <div>
        <label for="title">제목:</label>
        <input id="title" v-model="post.title" required>
      </div>
      <!-- 글쓴이 입력 필드 -->
      <div>
        <label for="author">글쓴이:</label>
        <input id="author" v-model="post.author" required>
      </div>
      <!-- 내용 입력 필드 -->
      <div>
        <label for="content">내용:</label>
        <textarea id="content" v-model="post.content" required></textarea>
      </div>
      <!-- 이미지 업로드 컴포넌트 -->
      <div>
        <label for="image">이미지:</label>
        <ImageUpload 
          id="image" 
          :initialImageId="post.ImageId"
          @image-uploaded="handleImageUploaded"
          @image-removed="handleImageRemoved"
        />
      </div>
      <!-- 제출 버튼 (로딩 중일 때 비활성화) -->
      <button type="submit" :disabled="postStore.loading">게시글 수정</button>
    </form>
    <!-- 에러 메시지 표시 -->
    <p v-if="postStore.error" class="error-message">{{ postStore.error }}</p>
    <!-- 로딩 중 메시지 표시 -->
    <p v-if="postStore.loading">로딩 중...</p>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePostStore } from '@/stores/postStore';
import ImageUpload from './ImageUpload.vue';

// Vue Router 인스턴스 생성
const router = useRouter();
const route = useRoute();

// Pinia store 인스턴스 생성
const postStore = usePostStore();

// 현재 게시글을 computed 속성으로 정의
const post = computed(() => postStore.currentPost);

// 컴포넌트가 마운트될 때 게시글 데이터 로드
onMounted(async () => {
  const postId = parseInt(route.params.id);
  await postStore.fetchPost(postId);
});

// 이미지 업로드 완료 시 호출되는 핸들러
const handleImageUploaded = (imageId) => {
  if (post.value) {
    post.value.ImageId = imageId;
  }
};

// 이미지 제거 시 호출되는 핸들러
const handleImageRemoved = () => {
  if (post.value) {
    post.value.ImageId = null;
  }
};

// 게시글 수정 함수
const updatePost = async () => {
  if (post.value) {
    await postStore.updatePost(post.value.id, post.value);
    if (!postStore.error) {
      // 에러가 없으면 홈페이지로 이동
      router.push('/');
    }
  }
};
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}
</style>