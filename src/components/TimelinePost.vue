<template>
  <router-link
    :key="post.id"
    class="panel-block"
    :to="to"
  >
    <div class="is-flex is-flex-direction-column is-align-items-flex-start">
      <a>{{ post.title }}</a>
      <div>
        <time :datetime="post.created.format('YYYY-MM-DDTHH:mm:SSSZ')">
        {{post.created.format('MMM Do HH:mm:ssA')}}
        </time>
        by @{{getAuthor(post.authorId) || '<deleted>'}}
        <!-- <p>{{post.markdown?.substr(0, 15)}}{{post.markdown && post.markdown.length > 16 ? '...': ''}}</p> -->
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Post } from '@/mocks';
import { useStore } from '@/store';

export default defineComponent({
  name: 'TimelinePost',

  props: {
      post: {
          type: Object as () => Post,
          required: true,
      },
  },

  setup(props) {
    const store = useStore();
    return {
      to: `/posts/${props.post.id}`,
      getAuthor: (id: string) => store.getState().authors.all.get(id)?.username
    }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
