import { PostsService } from './../../../services/posts.service';
import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit {
  posts: Array<Post> = [];

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService
      .getPostsUpdatedListener()
      .subscribe((posts: Array<Post>) => (this.posts = posts));
  }
}
