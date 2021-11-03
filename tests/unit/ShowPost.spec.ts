import { flushPromises, mount } from "@vue/test-utils";
import ShowPost from '../../src/components/ShowPost.vue';
import { Author, Store } from "../../src/store";
import { today } from "../../src/mocks";
import { routerWithStore } from "../../src/router";

describe('ShowPost', () => {
    it('does not show edit button when not authenticated', async () => {
        const store = new Store({
            posts: {
                ids: [today.id],
                all: new Map([[today.id, today]]),
                loaded: true,
            },
            authors: {
                ids: [today.authorId],
                all: new Map(),
                loaded: true,
                currentUserId: undefined,
            }
        });

        // setting up an actual router plugin for this test.
        const router = routerWithStore(store);
        // Need to make sure our route is set to the path we
        // expect to be testing, and AWAIT for the async router
        // method to finish routing to that location.
        router.push(`/posts/${today.id}`);
        await router.isReady();

        const wrapper = mount(ShowPost, {
            global: {
                plugins: [store, router]
            }
        });

        // since ShowPost is in a Suspense component, we need
        // to make sure we await until all promises are flushed
        await flushPromises();
        // console.log(wrapper.html());
        expect(wrapper.find('[data-test="can-edit"]').exists()).toBe(false);
    });

    it('does not show edit button when not authorized', async () => {
        const tester: Author = {
            id: '500',
            username: 'tester'
        };
        const store = new Store({
            posts: {
                ids: [today.id],
                all: new Map([[today.id, today]]),
                loaded: true,
            },
            authors: {
                ids: [tester.id],
                all: new Map([[tester.id, tester]]),
                loaded: true,
                currentUserId: tester.id,
            }
        });

        // setting up an actual router plugin for this test.
        const router = routerWithStore(store);
        // Need to make sure our route is set to the path we
        // expect to be testing, and AWAIT for the async router
        // method to finish routing to that location.
        router.push(`/posts/${today.id}`);
        await router.isReady();

        const wrapper = mount(ShowPost, {
            global: {
                plugins: [store, router]
            }
        });

        // since ShowPost is in a Suspense component, we need
        // to make sure we await until all promises are flushed
        await flushPromises();
        // console.log(wrapper.html());

        expect(wrapper.find('[data-test="can-edit"]').exists()).toBe(false);
    });

    it('shows edit button when authorized', async () => {
        const tester: Author = {
            id: '500',
            username: 'tester'
        };
        const store = new Store({
            posts: {
                ids: [today.id],
                all: new Map([[today.id, {
                    ...today,
                    authorId: tester.id,
                }]]),
                loaded: true,
            },
            authors: {
                ids: [tester.id],
                all: new Map([[tester.id, tester]]),
                loaded: true,
                currentUserId: tester.id,
            }
        });

        // setting up an actual router plugin for this test.
        const router = routerWithStore(store);
        // Need to make sure our route is set to the path we
        // expect to be testing, and AWAIT for the async router
        // method to finish routing to that location.
        router.push(`/posts/${today.id}`);
        await router.isReady();

        const wrapper = mount(ShowPost, {
            global: {
                plugins: [store, router]
            }
        });

        // since ShowPost is in a Suspense component, we need
        // to make sure we await until all promises are flushed
        await flushPromises();
        // console.log(wrapper.html());

        expect(wrapper.find('[data-test="can-edit"]').exists()).toBe(true);
    });

})