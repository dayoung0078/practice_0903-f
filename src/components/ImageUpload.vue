<template>
  <div class="image-upload">
    <!-- 파일 선택을 위한 숨겨진 input -->
    <input type="file" @change="handleFileSelect" accept="image/*" ref="fileInput">
    <!-- 파일 선택 버튼 -->
    <button @click="triggerFileInput">Select Image</button>
    
    <!-- 이미지 미리보기 섹션 -->
    <div v-if="preview" class="image-preview">
      <img :src="preview" alt="Image preview">
      <button @click="uploadImage" :disabled="postStore.loading">Upload</button>
    </div>
    
    <!-- 업로드된 이미지 표시 섹션 -->
    <div v-if="currentImage" class="uploaded-image">
      <img :src="currentImageUrl" alt="Uploaded image">
      <button @click="removeImage">Remove</button>
    </div>
    
    <!-- 에러 메시지 표시 -->
    <p v-if="postStore.error" class="error-message">{{ postStore.error }}</p>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { usePostStore } from '@/stores/postStore'

export default {
  name: 'ImageUpload',
  props: {
    // 초기 이미지 ID (이미지 수정 시 사용)
    initialImageId: {
      type: Number,
      default: null
    }
  },
  // 컴포넌트에서 발생시킬 수 있는 이벤트 정의
  emits: ['image-uploaded', 'image-removed'],
  setup(props, { emit }) {
    // 반응형 상태 정의
    const postStore = usePostStore()
    const fileInput = ref(null)  // 파일 input 요소에 대한 참조
    const selectedFile = ref(null)  // 선택된 파일
    const preview = ref(null)  // 이미지 미리보기 URL
    
    const currentImage = computed(() => postStore.currentImage)
    const currentImageUrl = computed(() => {
      return currentImage.value ? URL.createObjectURL(currentImage.value.blob) : null
    })

    onMounted(async () => {
      if (props.initialImageId) {
        await postStore.fetchImage(props.initialImageId)
      }
    })

    watch(() => props.initialImageId, async (newId) => {
      if (newId) {
        await postStore.fetchImage(newId)
      }
    })

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedFile.value = file
        preview.value = URL.createObjectURL(file)
        postStore.error = null
      }
    }

    // const uploadImage = async () => {
    //   if (!selectedFile.value) return

    //   try {
    //     const response = await postStore.uploadImage(selectedFile.value)
    //     emit('image-uploaded', response.id)
    //     preview.value = null
    //     selectedFile.value = null
    //   } catch (error) {
    //     console.error('Error uploading image:', error)
    //   }
    // }

    const uploadImage = async () => {
  if (!selectedFile.value) return

  try {
    const response = await postStore.uploadImage(selectedFile.value)

    // 응답이 기대하는 형식인지 확인
    if (response && response.id) {
      emit('image-uploaded', response.id)
      preview.value = null
      selectedFile.value = null
    } else {
      // 예상한 형태가 아니라면 에러 처리
      console.error('Unexpected response format:', response)
    }
  } catch (error) {
    console.error('Error uploading image:', error)
  }
}

    const removeImage = async () => {
      if (!currentImage.value) return

      try {
        await postStore.deleteImage(currentImage.value.id)
        emit('image-removed')
      } catch (error) {
        console.error('Error removing image:', error)
      }
    }

    return {
      postStore,
      fileInput,
      preview,
      currentImage,
      currentImageUrl,
      triggerFileInput,
      handleFileSelect,
      uploadImage,
      removeImage
    }
  }
}
</script>

<style scoped>
.image-upload {
  /* Add your styles here */
}

.image-preview, .uploaded-image {
  margin-top: 1rem;
}

.error-message {
  color: red;
}
</style>