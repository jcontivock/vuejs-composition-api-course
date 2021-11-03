import { nextTick } from '@vue/runtime-core'
import { mount, flushPromises } from '@vue/test-utils'
import moment from 'moment';
import PostWriter from '../../src/components/PostWriter.vue'
import { Post } from '../../src/mocks';

function setupTest(post: Post) {
  const wrapper = mount(PostWriter, {
    props: {
      post: post,
    }
  });
  return wrapper;
}

describe('PostWriter', () => {
  it('emits a savePost event with the new post', async (done) => {
    const post: Post = {
      id: '-1',
      title: 'New Banana',
      created: moment(),
    };
    const wrapper = setupTest(post);

    // we can use .setValue() to update "title" because we're binding
    // to "title" in that case using v-model
    await wrapper.find('[data-test="title"]').setValue('My New Title');
    // not so easy for our "content" case as that is bound via "contenteditable",
    // so we need to replicate what "contenteditable" is doing for us:
    // find the content, update its innerText, then trigger the "handleInput" event
    const $content = wrapper.find<HTMLDivElement>('[data-test="content"]');
    $content.element.innerText = '##My New Post';
    // await wrapper.find('[data-test="title"]').trigger('input');
    await $content.trigger('input');
    // because we expect the "html" property to be updated via a debounce,
    // we need to make sure to give the test enough time to pass.
    // adding a callback function ("done") to our test definition allows us
    // to tell the test not to finish until we've called that function.
    setTimeout(async() => {
      await wrapper.find('[data-test="submit"]').trigger('click');
      // wrapper.emitted() is a function that captures all the emitted events
      // all DOM events will be propagated, which means that while we're expecting
      // to catch the "savePost" event we'll also see the "click" event.
      const emitted = (wrapper.emitted()['savePost'] as any)[0][0];
      // await flushPromises();
      console.log(emitted);
      expect(emitted.title).toBe('My New Title');
      expect(emitted.markdown).toBe('##My New Post');
      expect(emitted.html).toBe('<p>##My New Post</p>\n');

      done();
    }, 300);
    // the setTimeout could be improved by looking into mock-timeout
  });

})