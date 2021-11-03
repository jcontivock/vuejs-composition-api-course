import { mount } from '@vue/test-utils'
import { Store, useStore } from '../../src/store';
// import { useRouter } from 'vue-router';
import NewPost from '../../src/components/NewPost.vue'
import { today, thisWeek, thisMonth, Post } from '../../src/mocks'

let routes: string[] = [];

jest.mock('axios', () => ({
  get: (url: string) => {
    return Promise.resolve({
      data: [today, thisWeek, thisMonth]
    });
  },
  post: (url: string, payload: any) => {
    return Promise.resolve({
      data: payload
    });
  }
}));

jest.mock('vue-router', () => ({
    useRouter: () => {
        return {
            push: (url: string) => {
                routes.push(url);
            }
        }
    }
}))

function setupTest(store: Store) {
  // second parameter is "options" where we'll specify "global",
  // the option used to specify all your plugins and data
  const wrapper = mount(NewPost, {
    global: {
      plugins: [store],
    }
  });
  return wrapper;
}

describe('NewPost', () => {
  // create a new Store for each test to use
  const store = new Store({
    authors: {
      ids: ['1000'],
      all: new Map([['1000', { id: '1000', username: 'username'}]]),
      loaded: true,
      currentUserId: '1000',
    },
    posts: {
      ids: [],
      all: new Map(),
      loaded: false,
    }
  });

  beforeEach(() => {
      routes = [];
  })

  it('creates a post and redirects to /', async () => {
    const wrapper = setupTest(store);

    expect(store.getState().posts.ids).toHaveLength(0);

    await wrapper.find('[data-test="submit"]').trigger('click');

    expect(store.getState().posts.ids).toHaveLength(1);
    expect(routes).toEqual(['/']);
  })
})