<template>
  <Suspense>
    <template #default>
      <PostEditor />
    </template>

    <template #fallback>
      <Spinner/>
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Spinner from './Spinner.vue';
import PostEditor from './PostEditor.vue';

export default defineComponent({
    components: {
        PostEditor,
        Spinner,
    }
});
</script>
