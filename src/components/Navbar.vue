<template>
    <div class="navbar">
        <div class="navbar-end">
            <div
                class="buttons"
                v-if="auth"
            >
                <router-link
                    class="button"
                    to="/posts/new"
                >
                New Post
                </router-link>

                <button
                  class="button"
                  @click="signOut">
                  Sign Out
                </button>
            </div>

            <div
                class="buttons"
                v-else
            >
                <button
                  class="button"
                  data-test="sign-up"
                  @click="signUp">
                  Sign Up
                </button>

                <button
                  class="button"
                  @click="signIn">
                  Sign In
                </button>
            </div>
        </div>
    </div>

    <teleport to="#modal">
        <component :is="component" />
    </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, markRaw } from 'vue';
import { useModal } from '../useModal';
import Signup from './Signup.vue';
import { useStore } from '../store';

export default defineComponent({
  name: 'Navbar',
  components: {
      Signup,
  },

  setup() {
    const store = useStore();
    const modal = useModal();

    const auth = computed(() => {
        return !!store.getState().authors.currentUserId;
    });

    const signIn = () => {};
    const signOut = () => {};
    const signUp = () => {
        modal.component.value = markRaw(Signup);
        modal.showModal();
    };

    return {
        auth,
        component: modal.component,
        signIn,
        signOut,
        signUp,
    }
  }
});
</script>
