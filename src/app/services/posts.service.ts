import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Array<Post> = [];
  private PostsUpdatedSubject: Subject<Array<Post>> = new Subject();

  constructor() {}

  getPostsUpdatedListener(): Observable<Array<Post>> {
    return this.PostsUpdatedSubject.asObservable();
  }

  addPost(title: string, content: string): void {
    const post = {
      title,
      content,
    };

    this.posts.push(post);
    this.PostsUpdatedSubject.next(this.posts.slice());
  }
}
