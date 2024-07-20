import { Injectable } from '@angular/core';
import { Events } from '../../../core/interfaces/cms.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CmsService {

  private baseUrl = 'https://thinktank-alpha.vercel.app/api/cms' // 'http://localhost:4000/api/cms';

  constructor() { }

  async fetchEvents(): Promise<Events> {
    try {
      const response = await fetch(`${this.baseUrl}/event`)
      const data = response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Error on fetching events: ${error.message}`);
    }
  }

  async fetchEvent(url: string) {
    try {
      const response = await fetch(`${this.baseUrl}/event/${url}`)
      const data = response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Error on fetching event: ${error.message}`);
    }
  }

  async fetchPosts(): Promise<Events> {
    try {
      const response = await fetch(`${this.baseUrl}/post`)
      const data = response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Error on fetching events: ${error.message}`);
    }
  }

  async fetchPost(url: string) {
    try {
      const response = await fetch(`${this.baseUrl}/post/${url}`)
      const data = response.json();
      return data;
    } catch (error: any) {
      throw new Error(`Error on fetching post: ${error.message}`);
    }
  }
}
