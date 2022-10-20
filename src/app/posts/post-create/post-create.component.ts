import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  @Output() createPostEvent: EventEmitter<{ title: string; content: string }> =
    new EventEmitter();

  enteredTitle: string = '';
  enteredContent: string = '';

  constructor() {}

  addPost(): void {
    const post = {
      title: this.enteredTitle,
      content: this.enteredContent,
    };

    this.createPostEvent.emit(post);
  }
}
