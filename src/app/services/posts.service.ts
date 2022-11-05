import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { POSTS_URL, SERVER_URL } from '../constants/url.constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Array<Post> = [];
  private postsUpdatedSubject: Subject<Array<Post>> = new Subject();
  private serverUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

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
            imagePath: post.imagePath,
          }))
        )
      )
      .subscribe((postList: Array<Post>) => {
        this.posts = postList;
        this.postsUpdatedSubject.next(this.posts.slice());
      });
  }

  getPost(id: string) {
    return this.http.get<Post>(
      `${SERVER_URL}${this.serverUrl}${POSTS_URL}${id}`
    );
  }

  getPostsUpdatedListener(): Observable<Array<Post>> {
    return this.postsUpdatedSubject.asObservable();
  }

  addPost(title: string, content: string, image: File): void {
    const postData = new FormData();
    postData.append('title', title),
      postData.append('content', content),
      postData.append('image', image, title);

    this.http
      .post<{ message: string; post: Post }>(
        `${SERVER_URL}${this.serverUrl}${POSTS_URL}`,
        postData
      )
      .subscribe((response) => {
        console.log(response.message);

        const post: Post = {
          id: response.post.id,
          title: response.post.title,
          content: response.post.content,
          imagePath: response.post.imagePath,
        };

        this.posts.push(post);
        this.triggerEventsOnSuccess();
      });
  }

  updatePost(
    id: string,
    title: string,
    content: string,
    image: File | string
  ): void {
    let postData: Post | FormData;

    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
      };
    }

    this.http
      .put<{ message: string; postId: string }>(
        `${SERVER_URL}${this.serverUrl}${POSTS_URL}${id}`,
        postData
      )
      .subscribe((response) => {
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: '',
        };
        console.log(response.message);
        const index = this.posts.findIndex((p) => p.id === id);
        this.posts.splice(index, 1, post);
        this.triggerEventsOnSuccess();
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

  private triggerEventsOnSuccess(): void {
    this.postsUpdatedSubject.next(this.posts.slice());
    this.router.navigate(['/']);
  }
}
