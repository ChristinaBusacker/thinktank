import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Events, Posts } from '../../../../core/interfaces/cms.interfaces';
import { SetEvents, SetPosts } from './cms.actions';


export interface CMSStateModel {
    events: Events;
    posts: Posts;
}

@State<CMSStateModel>({
    name: 'cms',
    defaults: {
        events: [],
        posts: []
    }
})
export class CMSState {
    @Selector()
    static getEvents(state: CMSStateModel): Events {
        return state.events;
    }

    @Selector()
    static getPosts(state: CMSStateModel): Posts {
        return state.posts;
    }

    @Action(SetEvents)
    setEvents(ctx: StateContext<CMSStateModel>, action: SetEvents) {
        ctx.patchState({
            events: action.events
        });
    }

    @Action(SetPosts)
    setPosts(ctx: StateContext<CMSStateModel>, action: SetPosts) {
        ctx.patchState({
            posts: action.posts
        });
    }
}
