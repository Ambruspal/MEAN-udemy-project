import { BaseComponent } from './../../base/base.component';
import { Post, PostResponse } from 'src/app/models/post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from './../../../services/posts.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private mode!: string;
  private postId?: string;
  post?: Post;
  isLoading: boolean = false;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.route.snapshot.params.postId) {
      this.mode = 'edit';
      this.postId = this.route.snapshot.params.postId;
      this.isLoading = true;
      this.postsService
        .getPost(this.postId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((post: PostResponse) => {
          this.isLoading = false;
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content,
          };
        });
    } else {
      this.mode = 'create';
    }
  }

  savePost(postForm: NgForm): void {
    if (postForm.invalid) return;

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(postForm.value.title, postForm.value.content);
      postForm.resetForm();
    } else {
      this.postsService.updatePost(
        this.postId,
        postForm.value.title,
        postForm.value.content
      );
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
