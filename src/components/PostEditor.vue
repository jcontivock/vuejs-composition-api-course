<template>
  <PostWriter
    :post="post"
    @savePost="save"
  />
</template>

<script lang="ts">
import { routerWithStore } from '../router';
import { defineComponent } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from '../store';
import PostWriter from './PostWriter.vue';
import { Post } from '../mocks';

export default defineComponent({
  components: {
      PostWriter
  },
  // Using an async setup() means we need to wrap
  // this component in a Suspense component, which
  // we've repurposed ShowPost.vue to do
  async setup(props) {
      const store = useStore();
      const router = useRouter();
      const id = useRoute().params.id as string;

      if (!store.getState().posts.loaded) {
          await store.fetchPosts();
      }
      const post = store.getState().posts.all.get(id);
      console.log(post);

      if (!post) {
          throw Error(`Post with id: ${id} was not found!`);
      }

      if (post.authorId !== store.getState().authors.currentUserId) {
          router.push('/');
      }

        const save = async (post: Post) => {
            await store.updatePost(post);
            router.push('/');
        }

      return {
          post,
          save,
      }
  },
});
</script>
