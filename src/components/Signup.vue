<template>
    <form @submit.prevent="submit">
        <FormInput
            v-model="username"
            name="Username"
            type="text"
            :error="usernameStatus.message"
        />

        <FormInput
            v-model="password"
            name="Password"
            type="password"
            :error="passwordStatus.message"
        />

        <button
          class="button is-primary"
          :disabled="!usernameStatus.valid || !passwordStatus.valid"
        >
         Submit
        </button>
        <div
          class="notification is-danger is-light"
          v-if="!signupStatus.valid">
          {{signupStatus.message}}
        </div>
    </form>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import FormInput from './FormInput.vue';
import { length, required, Status, validate } from '../validation';
import { User, useStore } from '../store';
import { useModal } from '../useModal';

export default defineComponent({
  name: 'Signup',
  components: {
    FormInput,
  },

  setup() {
    const store = useStore();
    const modal = useModal();

    const username = ref('username');
    const usernameStatus = computed<Status>(() => {
      return validate(username.value, [required(), length({min: 6, max: 16})]);
    });

    const password = ref('password');
    const passwordStatus = computed<Status>(() => {
      return validate(password.value, [required(), length({min: 16, max: 32})]);
    });

    // should really be an error message returned from the backend,
    // which we'd just display in case of an error
    const signupStatus = ref(<Status>{
        valid: true,
        message: 'Username not available!',
    });

    const submit = async (e: Event) => {
        if (!usernameStatus.value.valid || !passwordStatus.value.valid) {
            return;
        }

        const newUser: User = {
            id: '-1',
            username: username.value,
            password: password.value,
        }

        if (!store.usernameAvailable(newUser.username)) {
          signupStatus.value.valid = false;
          console.log(`Username ${newUser.username} not available!`);
          return;
        }

        await store.createUser(newUser);
        modal.hideModal();
        // reset form
        username.value = 'username';
        password.value = 'password';
        signupStatus.value.valid = true;

    };

    return {
      username,
      usernameStatus,
      password,
      passwordStatus,
      signupStatus,
      submit,
    }
  }
});
</script>

<style scoped>
form {
    padding: 15px;
    background: white;
}
</style>
