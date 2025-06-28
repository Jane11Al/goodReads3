import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../services/book.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '../services/auth.service'; 
import { UserService } from '../services/user.service'; 
import { SubscriptionService } from '../services/subscription.service';
@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: any = null;
  authors: string[] = [];
  genres: string[] = [];
  publisherName: string = '';
  isbn: string = '';
  year: number = 0;
  id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private authService: AuthService,
    private userService: UserService,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadBookDetails(+this.id);
    }
  }

  private loadBookDetails(bookId: number): void {
    this.book = this.bookService.getBookById(bookId);

    if (!this.book) return;

    this.authors = this.bookService.getAuthorsForBook(bookId);
    this.genres = this.bookService.getGenresForBook(bookId);

    const publisher = this.bookService.getPublisherById(this.book.publisherId);
    this.publisherName = publisher ? publisher.name : 'Неизвестно';

    this.isbn = this.book.isbn;
    this.year = this.book.year;
  }

  goBack(): void {
    window.history.back();
  }
/* 
  subscribeToBook(bookId: number, type: 'preorder' | 'restock'): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userService.subscribeToNotification(user.username, bookId, type);
    }
  }*/
  subscribeToBook(): void {
    this.subscriptionService.addSubscription(this.book);
    alert(`Вы подписались на "${this.book.title}"`);
  }
}
