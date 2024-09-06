<template>
  <div>
    <h2>새 게시글 작성</h2>
    <form @submit.prevent="createPost">
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
      <!-- 내용 입력 필드 (텍스트 영역) -->
      <div>
        <label for="content">내용:</label>
        <textarea id="content" v-model="post.content" required></textarea>
      </div>
      <!-- 이미지 업로드 컴포넌트 -->
      <div>
        <label for="image">이미지:</label>
        <ImageUpload 
          id="image" 
          @image-uploaded="handleImageUploaded"
        />
      </div>
      <!-- 제출 버튼 (store의 로딩 상태에 따라 비활성화) -->
      <button type="submit" :disabled="postStore.loading">게시글 작성</button>
    </form>
    <!-- 에러 메시지 표시 -->
    <p v-if="postStore.error" class="error-message">{{ postStore.error }}</p>
  </div>
</template>

<script setup>
// 필요한 Vue 3 API와 컴포넌트, store 임포트
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { usePostStore } from '@/stores/postStore';
import ImageUpload from './ImageUpload.vue';

// Vue Router 인스턴스 생성
const router = useRouter();

// Pinia store 인스턴스 생성
const postStore = usePostStore();

// 게시글 데이터를 위한 반응형 객체 생성
const post = reactive({
  title: '',
  author: '',
  content: '',
  ImageId: null  // ImageUrl 대신 ImageId 사용
});

// 이미지 업로드 완료 시 호출되는 핸들러
const handleImageUploaded = (imageId) => {
  post.ImageId = imageId;  // ImageUrl 대신 ImageId 저장
};

// 게시글 생성 함수
const createPost = async () => {
  try {
    // store의 createPost 액션을 사용하여 게시글 생성
    await postStore.createPost(post);
    // 에러가 없으면 홈페이지로 이동
    if (!postStore.error) {
      router.push('/'); // 홈페이지로 이동
    }
  } catch (error) {
    console.error('Error creating post:', error);
    // 에러 처리는 store에서 하므로 여기서는 추가 처리 불필요
  }
};
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
}
</style>