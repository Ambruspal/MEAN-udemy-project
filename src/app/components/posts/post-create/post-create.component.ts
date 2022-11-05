import { BaseComponent } from './../../base/base.component';
import { Post } from 'src/app/models/post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from './../../../services/posts.service';
import { takeUntil } from 'rxjs/operators';
import { mimeType } from 'src/app/utils/mime-type.validator';

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
  postForm: FormGroup;
  imagePreviewUrl?: string;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.postForm = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      content: new FormControl(null, Validators.required),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    if (this.route.snapshot.params.postId) {
      this.mode = 'edit';
      this.postId = this.route.snapshot.params.postId;
      this.isLoading = true;
      this.postsService
        .getPost(this.postId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((post: Post) => {
          this.isLoading = false;
          this.post = {
            id: post.id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
          };
          this.postForm.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
        });
    } else {
      this.mode = 'create';
    }
  }

  pickImage(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({
      image: file,
    });
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => (this.imagePreviewUrl = reader.result as string);
    reader.readAsDataURL(file);
  }

  savePost(): void {
    if (this.postForm.invalid) return;

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.postForm.value.title,
        this.postForm.value.content,
        this.postForm.value.image
      );
      this.postForm.reset();
    } else {
      this.postsService.updatePost(
        this.postId,
        this.postForm.value.title,
        this.postForm.value.content,
        this.postForm.value.image
      );
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
