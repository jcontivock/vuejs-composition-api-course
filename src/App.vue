<template>
  <div class="modal" :style="style" >
    <div class="modal-background"></div>
    <div class="modal-content">
      <div id="modal"></div>
    </div>
    <button
      class="modal-close is-large"
      @click="closeSignUp"
    ></button>
  </div>
  <!-- "section" and "container" are Bulma-specific classes! -->
  <section class="section">
    <div class="container">
      <Navbar />
      <div id="mainContent">
        <router-view />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import Navbar from './components/Navbar.vue';
import { useModal } from './useModal';

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
},

  setup() {
    const modal = useModal();

    const style = computed(() => {
      return {
        display: modal.show.value ? 'block' : 'none',
      };
    });

    return {
      style,
      closeSignUp: () => {
        modal.hideModal()
      }
    }
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

#mainContent {
  padding-top: .75rem;
}
</style>
