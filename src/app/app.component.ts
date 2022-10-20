import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  savedPosts: Array<{ title: string; content: string }> = [];

  onAddPost(post: { title: string; content: string }): void {
    this.savedPosts.push(post);
  }
}
