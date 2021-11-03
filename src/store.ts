import { reactive, readonly, provide, inject, App } from 'vue';
import axios from 'axios';
import { Post, today, thisWeek, thisMonth } from './mocks';

export interface User {
    id: string,
    username: string,
    password: string,
}

// self-explanatory
export type Author = Omit<User, 'password'>;

// made generic so we can reuse it as much as possible
interface BaseState<T> {
    ids: string[];
    all: Map<string, T>;
    loaded: boolean;
}

type PostsState = BaseState<Post>;
interface AuthorsState extends BaseState<Author> {
    currentUserId: string | undefined
};

// ref works really well with primitives
// reactive works really well with objects

// defining this class using the following interfaces
// is a way to ensure strong typing for important things
export interface State {
    authors: AuthorsState;
    posts: PostsState;
}

export class Store {
    private state: State;

    constructor(initial: State) {
        this.state = reactive(initial)
    };

    install(app: App) {
        app.provide(storeKey, this);
    }

    getState() {
        // wrapping our returned value with readonly ensures
        // the property can't be overwritten after getting, only
        // by using a defined update method
        return readonly(this.state);
    };


    async createPost(post: Post) {
        const response = await axios.post<Post>('/posts', post);
        // console.log(response);
        this.state.posts.all.set(response.data.id, response.data);
        this.state.posts.ids.push(response.data.id);
    }

    async updatePost(post: Post) {
        const response = await axios.put<Post>('/posts', post);
        // console.log(response);
        this.state.posts.all.set(response.data.id, response.data);
    }

    async createUser(user: User) {
        const response = await axios.post<Author>('/users', user);
        console.log(response);
        this.state.authors.all.set(response.data.id, response.data);
        this.state.authors.ids.push(response.data.id);
        this.state.authors.currentUserId = response.data.id;
        console.log(this.state.authors);
    }

    async fetchPosts() {
        const response = await axios.get<Post[]>('/posts');
        const postsState: PostsState = {
            ids: [],
            all: new Map(),
            loaded: true
        };
        for (const post of response.data) {
            postsState.ids.push(post.id);
            postsState.all.set(post.id, post);
        }
        this.state.posts = postsState;
    }
}


export const storeKey = Symbol('store');

export const store = new Store({
    authors: {
        all: new Map<string, Author>(),
        ids: [],
        loaded: false,
        currentUserId: undefined,
    },
    posts: {
        all: new Map<string, Post>(),
        ids: [],
        loaded: false,
    }
});

// make this a "composable" object
// will switch to using provide/inject soon
export function useStore(): Store {
    const _store = inject<Store>(storeKey);
    if (!_store) {
        throw Error('Did you forget to call provide?');
    }

    return _store;
}