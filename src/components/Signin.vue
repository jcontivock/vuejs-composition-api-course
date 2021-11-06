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
          v-if="signinStatus.valid === false">
          {{signinStatus.message}}
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
  name: 'Signin',
  components: {
    FormInput,
  },

  setup() {
    const store = useStore();
    const modal = useModal();

    const username = ref('username');
    const usernameStatus = computed<Status>(() => {
      return validate(username.value, [required(), length({min: 5, max: 16})]);
    });

    const password = ref('password');
    const passwordStatus = computed<Status>(() => {
      return validate(password.value, [required(), length({min: 16, max: 32})]);
    });

    const signinStatus = ref(<Status>{
        valid: true,
        message: undefined,
    });

    const submit = async (e: Event) => {
        if (!usernameStatus.value.valid || !passwordStatus.value.valid) {
            console.log('Username or password not valid!');
            return;
        }
        signinStatus.value.valid = true;

        const existingUser: User = {
            id: '-1',
            username: username.value,
            password: password.value,
        }

        store.getState().authors.all.forEach(a => {
            if (a.username === username.value) {
                existingUser.id = a.id;
            }
        });

        if (existingUser.id === '-1') {
            signinStatus.value.message = 'User does not exist';
            signinStatus.value.valid = false;
            console.log(`${signinStatus.value.message}`);
            return;
        }

        await store.signInUser(existingUser);
        if (store.getState().authors.currentUserId === existingUser.id) {
            // successful login
            console.log('Login successful!');
            modal.hideModal();
            // reset form
            username.value = 'username';
            password.value = 'password';
        } else {
            signinStatus.value.message = "Password incorrect";
            signinStatus.value.valid = false;
            console.log(`${signinStatus.value.message}`);
        }
    };

    return {
      username,
      usernameStatus,
      password,
      passwordStatus,
      signinStatus,
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
