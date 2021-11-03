import { flushPromises, mount } from "@vue/test-utils";
import Navbar from '../../src/components/Navbar.vue';
import Signup from '../../src/components/Signup.vue';
import { Store, Author } from "../../src/store";
import { Post } from '../../src/mocks';

describe('Navbar', () => {
    it('shows a signup modal via teleport', async () => {
        const store = new Store({
            authors: {
                all: new Map<string, Author>(),
                ids: [],
                loaded: false,
                currentUserId: undefined,
            },        
            posts: {
                ids: [],
                all: new Map<string, Post>(),
                loaded: false,
            }
        });

        // create the element that teleport will be looking for
        const el = document.createElement('div');
        el.id = 'modal'; // same as in App.vue
        document.body.appendChild(el);

        const wrapper = mount(Navbar, {
            // define where to "attachTo" the id="modal" div element we created
            // for the teleport to work correctly
            attachTo: document.body,
            global: {
                // define a stubbed-out version of "router-link"
                // to avoid the complexities of trying to use the real thing
                components: {
                    RouterLink: {
                        template: `<div></div>`
                    }
                },
                plugins: [store]
            }
        });

        await wrapper.get('[data-test="sign-up"]').trigger('click');

        // to find the form element rendered by teleport, we need to search outside of our wrapper.
        // need to search through the virtual DOM to find our element.
        const form = wrapper.getComponent(Signup);
        // console.log(form);

        expect(document.body.outerHTML).toContain('This value must have a length between 16 and 32');

        // "get" will throw an error if the element isn't found
        await form.get('#Username').setValue("NewUser");
        await form.get('#Password').setValue("longenoughpassword");
        
        expect(document.body.outerHTML).not.toContain('This value must have a length between 16 and 32');
        
        await form.trigger('submit.prevent');
    })
})