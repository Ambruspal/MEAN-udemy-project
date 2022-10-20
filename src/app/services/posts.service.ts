import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { POSTS_URL, SERVER_URL } from '../constants/url.constants';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Array<Post> = [];
  private postsUpdatedSubject: Subject<Array<Post>> = new Subject();
  private serverUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPosts(): void {
    this.http
      .get<{ message: string; posts: Array<any> }>(
        `${SERVER_URL}${this.serverUrl}${POSTS_URL}`
      )
      .pipe(
        map((response) =>
          response.posts.map((post) => ({
            title: post.title,
            content: post.content,
            id: post._id,
          }))
        )
      )
      .subscribe((postList: Array<Post>) => {
        this.posts = postList;
        this.postsUpdatedSubject.next(this.posts.slice());
      });
  }

  getPostsUpdatedListener(): Observable<Array<Post>> {
    return this.postsUpdatedSubject.asObservable();
  }

  addPost(title: string, content: string): void {
    const post = {
      title,
      content,
    };

    this.http
      .post<{ message: string }>(
        `${SERVER_URL}${this.serverUrl}${POSTS_URL}`,
        post
      )
      .subscribe((response) => {
        console.log(response.message);
        this.posts.push(post);
        this.postsUpdatedSubject.next(this.posts.slice());
      });
  }

  deletePost(id: string): void {
    this.http
      .delete(`${SERVER_URL}${this.serverUrl}${POSTS_URL}${id}`)
      .subscribe(() => {
        console.log('Post is deleted!');
        this.posts = this.posts.filter((post) => post.id !== id);
        this.postsUpdatedSubject.next(this.posts.slice());
      });
  }
}
