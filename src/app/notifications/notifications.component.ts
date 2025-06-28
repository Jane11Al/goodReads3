import { Component } from '@angular/core';
import { BookService } from '../services/book.service';
import { PreorderService } from '../services/preorder.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule], // Добавляем CommonModule
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  preorderBooks: any[] = [];
  userSubscriptions: any[] = [];

  constructor(
    private bookService: BookService,
    private preorderService: PreorderService
  ) { }

  ngOnInit() {
   // this.loadPreorderBooks();
    this.loadUserSubscriptions();
  }
/*
  loadPreorderBooks() {
    this.bookService.getPreorderBooks().subscribe(books => {
      this.preorderBooks = books;
    });
  }*/

  loadUserSubscriptions() {
    this.preorderService.getUserSubscriptions().subscribe(subscriptions => {
      this.userSubscriptions = subscriptions;
    });
  }

  toggleSubscription(bookId: number) {
    this.preorderService.toggleSubscription(bookId).subscribe(() => {
      this.loadUserSubscriptions();
    });
  }

  isSubscribed(bookId: number): boolean {
    return this.userSubscriptions.some(sub => sub.bookId === bookId);
  }
}
