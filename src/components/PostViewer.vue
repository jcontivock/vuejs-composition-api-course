<template>
  <div class="columns">
    <div class="column" />
    <div class="column is-two-thirds">
      <div class="card">
        <header class="card-header" v-if="canEdit">
          <p class="card-header-title"/>
          <!--
          <button class="card-header-icon" aria-label="more options">
            <span class="icon">
              <i class="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </button>
          -->
          <router-link
            :to="`/posts/${post.id}/edit`"
            class="button is-link is-rounded card-header-icon"
            v-if="canEdit"
            data-test="can-edit"
          >
            Edit
          </router-link>
          <router-link
            :to="`/posts/${post.id}/delete`"
            class="button is-link is-rounded card-header-icon is-danger is-light"
            v-if="canEdit"
            data-test="can-delete"
          >
            Delete
          </router-link>
        </header>
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">{{ post.title }}</p>
              <p class="subtitle is-6">
                Created on
                <time :datetime="post.created.format('YYYY-MM-DDTHH:mm:SSSZ')">
                {{post.created.format('LLL')}}
                </time>
                <br/>
                by @{{postAuthor.username}}
              </p>
            </div>
          </div>

          <div class="content">
            <article class="message">
              <div class="message-body">
                <div v-html="post.html" />
              </div>
            </article>
          </div>
        </div>
      </div>
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

      const postAuthor = {
        id: '-1',
        username: 'unknown',
        ...store.getState().authors.all.get(post.authorId)
      };

      const canEdit = post.authorId === store.getState().authors.currentUserId;
      // (<HTMLTimeElement> document.getElementById('postCreated')).dateTime = post.created.format();

      return {
          canEdit,
          post,
          postAuthor,
      }
  },
});
</script>
