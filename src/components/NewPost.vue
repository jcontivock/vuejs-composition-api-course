<template>
  <PostWriter
    :post="newPost"
    @savePost="save"
  />
</template>

<script lang="ts">
import { Post } from '../mocks';
import { defineComponent } from '@vue/runtime-core';
import PostWriter from './PostWriter.vue';
import moment from 'moment';
import { useStore } from '../store';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: "NewPost",
    components: {
        PostWriter,
    },

    setup() {
        const store = useStore();
        const router = useRouter();
        const authorId = store.getState().authors.currentUserId;

        if (!authorId) {
          throw Error('Current UserId not found!');
        }

        const newPost: Post = {
            id: '-1',
            title: 'Enter your title...',
            // subtracting 1 second to get around issue with moment
            created: moment().subtract(1, 'second'),
            authorId,
        }


        const save = async (post: Post) => {
            await store.createPost(post);
            router.push('/');
        }

        return {
          newPost,
          save
        };
    }
})
</script>

<style>
</style>