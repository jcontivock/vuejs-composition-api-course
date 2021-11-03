<template>
  <Suspense>
    <template #default>
      <PostViewer />
    </template>

    <template #fallback>
      <Spinner/>
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Spinner from './Spinner.vue';
import PostViewer from './PostViewer.vue';

export default defineComponent({
    components: {
        PostViewer,
        Spinner,
    }
});
</script>
