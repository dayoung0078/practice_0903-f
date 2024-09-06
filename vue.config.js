const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  // 트랜스파일이 필요한 종속성 목록
  // true로 설정하면 모든 의존성에 대해 트랜스파일을 수행
  transpileDependencies: true,

  // Webpack 설정을 추가로 구성
  configureWebpack: {
    plugins: [
      // Webpack의 DefinePlugin을 사용하여 전역 상수를 정의
      new webpack.DefinePlugin({
        // Vue 3의 hydration 불일치 세부 정보를 비활성화
        // 이는 서버 사이드 렌더링(SSR)과 관련된 설정으로,
        // 클라이언트와 서버 간의 렌더링 불일치 경고를 억제
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
      })
    ]
  },

  // 개발 서버 설정
  devServer: {
    proxy: {
      // '/api'로 시작하는 요청에 대한 프록시 설정
      '/api': {
        // 프록시할 대상 서버 주소
        target: 'http://localhost:8080',
        // 호스트 헤더를 대상 URL의 호스트 이름으로 변경
        // CORS 이슈를 방지
        changeOrigin: true
      }
    }
  }
})