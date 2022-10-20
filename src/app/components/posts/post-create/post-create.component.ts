import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from './../../../services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  constructor(private postsService: PostsService) {}

  addPost(postForm: NgForm): void {
    if (postForm.invalid) return;

    this.postsService.addPost(postForm.value.title, postForm.value.content);
    postForm.resetForm();
  }
}
