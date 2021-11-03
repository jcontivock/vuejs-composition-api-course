import { Store, useStore } from '../../src/store';
import { nextTick } from '@vue/runtime-core'
import { mount, flushPromises, RouterLinkStub } from '@vue/test-utils'
import Timeline from '../../src/components/Timeline.vue'
import { today, thisWeek, thisMonth } from '../../src/mocks'

jest.mock('axios', () => ({
  get: (url: string) => {
    return Promise.resolve({
      data: [today, thisWeek, thisMonth]
    });
  }
}));

function setupTest() {
  // define a component, making sure
  // to register our Timeline component with it
  const testComponent = {
    components: { Timeline },
    template: `
      <suspense>
        <template #default>
          <Timeline />
        </template>
        <template #fallback>
          Loading...
        </template>
      </suspense>
    `
  };
  // create a new Store for each test to use
  const store = new Store({
    authors: {
      ids: [],
      all: new Map(),
      loaded: false,
      currentUserId: undefined,
    },
    posts: {
      ids: [],
      all: new Map(),
      loaded: false,
    }
  });
  // second parameter is "options" where we'll specify "global",
  // the option used to specify all your plugins and data
  const wrapper = mount(testComponent, {
    global: {
      components: {
        RouterLink: RouterLinkStub
      },
      plugins: [store],
    }
  });
  return wrapper;
}

describe('Timeline', () => {
  it('renders today post default', async () => {
    const wrapper = setupTest();
    await flushPromises();
    // console.log(wrapper.html());

    expect(wrapper.html()).toContain(today.created.format('Do MMM'));
  })

  it('updates when the thisWeek period is clicked', async () => {
    const wrapper = setupTest();
    await flushPromises();

    // need to wait for requestAnimationFrame(() => ...) to advance
    await wrapper.get('[data-test="This Week"]').trigger('click');
    expect(wrapper.html()).toContain(today.created.format('Do MMM'));
    expect(wrapper.html()).toContain(thisWeek.created.format('Do MMM'));
  })

  it('updates when the thisMonth period is clicked', async () => {
    const wrapper = setupTest();
    await flushPromises();

    // need to wait for requestAnimationFrame(() => ...) to advance
    await wrapper.get('[data-test="This Month"]').trigger('click');
    expect(wrapper.html()).toContain(today.created.format('Do MMM'));
    expect(wrapper.html()).toContain(thisWeek.created.format('Do MMM'));
    expect(wrapper.html()).toContain(thisMonth.created.format('Do MMM'));
  })
})