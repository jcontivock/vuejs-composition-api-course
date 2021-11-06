import { createApp } from 'vue';
import {today, thisWeek, thisMonth, Post } from './mocks';
import App from './App.vue';
import { routerWithStore } from './router';
import axios from 'axios';
import { random } from 'lodash';
import 'highlight.js/styles/atom-one-dark.css';
import { storeKey, store, User, Author } from './store';
import { useRoute } from 'vue-router';

function delay() {
    return new Promise(res => {
        setTimeout(res, 1000);
    })
}

// @ts-ignore
axios.get = async (url: string) => {
    if (url === '/posts') {
        await delay();
        return Promise.resolve({
            data: [today, thisWeek, thisMonth]
        });
    }
}

// @ts-ignore
axios.post = async (url: string, payload: any) => {
    if (url === '/posts') {
        await delay();
        const id = random(100, 10000).toString();
        const post: Post = {
            ...payload,
            id: id,
            title: payload.title,
            created: payload.created,
            authorId: payload.authorId,
        };

        return Promise.resolve<{data: Post}>({
            data: post
        });
    }
        
    if (url === '/users') {
        await delay();
        const id = random(100, 10000).toString();
        const author: Author = {
            id: id.toString(),
            username: payload.username
        }
        return Promise.resolve<{data: Author}>({
            data: author
        });
    }

    if (url === '/login') {
        await delay();
        const author: Author = {
            ...payload
        };
        return Promise.resolve<{data: Author}>({
            data: author
        });
    }
}

// @ts-ignore
axios.put = async (url: string, payload: any) => {
    if (url === '/posts') {
        await delay();
        return Promise.resolve({
            data: payload
        });
    }
}


const app = createApp(App);
// add plugins to the component (app)
const router = routerWithStore(store);
app.use(router);
app.use(store);
app.mount('#app');
