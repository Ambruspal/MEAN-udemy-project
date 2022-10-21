import { PostsService } from './../../../services/posts.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Array<Post> = [];
  subscription: Subscription = new Subscription();
  isLoading: boolean = false;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsService
      .getPostsUpdatedListener()
      .subscribe((posts: Array<Post>) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  deletePost(id: string): void {
    this.postsService.deletePost(id);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
