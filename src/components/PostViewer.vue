<template>
  <div class="columns">
    <div class="column" />
    <div class="column is-two-thirds">
      <router-link
        :to="`/posts/${post.id}/edit`"
        class="button is-link is-rounded"
        v-if="canEdit"
        data-test="can-edit"
      >
        Edit
      </router-link>
      <h1>{{ post.title }}</h1>
      <div v-html="post.html" />
    </div>
    <div class="column" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '../store';

export default defineComponent({
  // Using an async setup() means we need to wrap
  // this component in a Suspense component, which
  // we've repurposed ShowPost.vue to do
  async setup(props) {
      const store = useStore();
      const id = useRoute().params.id as string;

      if (!store.getState().posts.loaded) {
          await store.fetchPosts();
      }
      const post = store.getState().posts.all.get(id);
    //   console.log(post);

      if (!post) {
          throw Error(`Post with id: ${id} was not found!`);
      }

      const canEdit = post.authorId === store.getState().authors.currentUserId;

      return {
          canEdit,
          post,
      }
  },
});
</script>
