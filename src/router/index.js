import { createRouter, createWebHistory } from 'vue-router';
import PostCreate from '@/components/PostCreate.vue';
import PostEdit from '@/components/PostEdit.vue';
import PostView from '@/components/PostView.vue';
import PostList from '@/components/PostList.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: PostList,
  },
  {
    path: '/post/create',
    name: 'PostCreate',
    component: PostCreate,
  },
  {
    path: '/post/:id',
    name: 'PostView',
    component: PostView,
  },
  {
    path: '/post/:id/edit',
    name: 'PostEdit',
    component: PostEdit,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;