<template>
  <div class="columns">
      <div class="column">
        <div class="field">
          <div class="label">New Post</div>
          <input
            type="text"
            class="input"
            v-model="title"
            data-test="title"
          >
        </div>
      </div>
  </div>

  <div class="columns">
      <!-- lefthand column is where you write the text -->
      <!-- the @input="handleInput" binding is how we achieve two-way binding to content -->
      <div class="column">
          <div
            contenteditable
            ref="contentEditable"
            @input="handleInput"
            data-test="content"
         />
      </div>
      <!-- righthand column is where your text is rendered as HTML -->
      <div class="column">
          <div v-html="html" />
      </div>
  </div>

  <div class="columns">
      <div class="column">
          <button
            class="is-primary is-pulled-right"
            @click="savePost"
            data-test="submit"
          >Submit</button>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, watchEffect } from 'vue';
import { Post } from '../mocks';
import { parse } from 'marked';
import highlight from 'highlight.js';
import debounce from 'lodash/debounce';

export default defineComponent({
    props: {
        post: {
            type: Object as () => Post,
            required: true,
        }
    },

    // declare that this component will emit events
    // this is also a great place to do some validation
    emits: {
        savePost: (post: Post) => {
            // validation
            // could return false or throw an Error if validation fails
            return true;
        },
    },

    // initialize using default props
    setup(props, ctx) {
        // ref to the default props' post's title,
        // so when it changes, this title value changes
        const title = ref(props.post.title);
        const content = ref(props.post.markdown || '');
        // rendered in Vue's contenteditable directive
        // will be null by default, so we need to specify the types it can be
        const contentEditable = ref<HTMLDivElement | null>(null);
        // see that contentEditable defaults to null until after mounting
        // console.log(contentEditable.value);
        const html = ref('');
        // need to ensure that "html" is updated whenever "content" is updated
        // could use the "watch" directive to accomplish this
        // watch(content, (newContent) => {
        //     html.value = parse(newContent);
        // }, {
        //     // options for when to call watch
        //     // setting 'immediate' to true means we no longer have to do the initial parse
        //     // when defining 'html'
        //     immediate: true,
        // });

        // this is functionally equivalent to the above "watch" definition
        // and is more concise, so we'd use watchEffect
        // But wait! This results in a rough experience caused by too many updates
        // as the user types, so we'll switch to a debounce/watch combo down below
        // watchEffect(() => {
        //     html.value = parse(content.value, {
        //         // github flavored markdown
        //         gfm: true,
        //         breaks: true,
        //         highlight: (code: string) => {
        //             return highlight.highlightAuto(code).value;
        //         }
        //     });
        // });

        const parseHtml = (str: string) => {
            html.value = parse(str, {
                // github flavored markdown
                gfm: true,
                breaks: true,
                highlight: (code: string) => {
                    return highlight.highlightAuto(code).value;
                }
            });
        }

        watch(content, debounce(parseHtml, 250), {
            immediate: true
        })

        const handleInput = () => {
            // explicitly handle the null checks to avoid errors
            if (!contentEditable.value) {
                // shouldn't happen, must be defensive though
                throw Error('This should never happen!');
            }
            content.value = contentEditable.value.innerText || '';
        };

        onMounted(() => {
            // now that contentEditable is a reference to our DOM element,
            // we can bind it's textContent to the value of our content property
            if (!contentEditable.value) {
                // shouldn't happen, must be defensive though
                throw Error('This should never happen!');
            }
            contentEditable.value.innerText = content.value;
            // see that contentEditable no longer null after mounting
            // console.log(contentEditable.value);
        });

        const savePost = () => {
            const newPost: Post = {
                ...props.post,
                title: title.value,
                html: html.value,
                markdown: content.value,
            };

            ctx.emit('savePost', newPost);
        }
        // make sure to return the properties we just created
        // to make them available to our template
        return {
            title,
            content,
            contentEditable,
            handleInput,
            html,
            savePost,
        };
    }
});
</script>

<style>
.column {
    overflow-y: auto;
}
</style>
