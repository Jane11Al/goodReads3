import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { Book, BookSubscription } from '../services/book.model';
import { SubscriptionService } from '../services/subscription.service';
import { AuthService } from '../services/auth.service';
import { CurrencyPipe, DatePipe } from '@angular/common'; 
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, CommonModule], 
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: Book | undefined;
  isSubscribedToRestock = false;
  isSubscribedToPreorder = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private bookService: BookService,
    private subscriptionService: SubscriptionService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.book = this.bookService.getBookById(+id);
      this.checkSubscriptions();
    }
  }
  goBack(): void {
    this.router.navigate(['/']); 
  }
  getAuthorNames(authorIds: number[] | undefined): string {
    if (!authorIds || authorIds.length === 0) return 'Автор неизвестен';
    return authorIds.map(id => {
      const author = this.bookService.getAuthorById(id);
      return author ? author.fullName : 'Неизвестный автор';
    }).join(', ');
  }

  getGenreNames(genreIds: number[] | undefined): string {
    if (!genreIds || genreIds.length === 0) return 'Жанр не определен';
    return genreIds.map(id => {
      const genre = this.bookService.getGenreById(id);
      return genre ? genre.name : 'Неизвестный жанр';
    }).join(', ');
  }

  getPublisherName(publisherId: number | undefined): string {
    if (!publisherId) return 'Издатель неизвестен';
    const publisher = this.bookService.getPublisherById(publisherId);
    return publisher ? publisher.name : 'Неизвестный издатель';
  }

  private checkSubscriptions(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !this.book) return;

    const userSubs = this.subscriptionService.getUserSubscriptions(user.username);

    this.isSubscribedToRestock = userSubs.some(
      sub => sub.bookId === this.book!.id && sub.type === 'restock'
    );

    this.isSubscribedToPreorder = userSubs.some(
      sub => sub.bookId === this.book!.id && sub.type === 'preorder'
    );
  }

  subscribeToPreorder(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !this.book) return;

    const newSubscription: BookSubscription = {
      id: Date.now(),
      username: user.username,
      bookId: this.book.id,
      type: 'preorder',
      createdAt: new Date(),
      notified: false
    };

    this.subscriptionService.addSubscription(newSubscription);
    this.isSubscribedToPreorder = true;
  }

  subscribeToRestock(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !this.book) return;

    const newSubscription: BookSubscription = {
      id: Date.now(),
      username: user.username,
      bookId: this.book.id,
      type: 'restock',
      createdAt: new Date(),
      notified: false
    };

    this.subscriptionService.addSubscription(newSubscription);
    this.isSubscribedToRestock = true;
  }

  unsubscribePreorder(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !this.book) return;

    const subscriptions = this.subscriptionService.getUserSubscriptions(user.username);
    const subscription = subscriptions.find(s =>
      s.bookId === this.book!.id &&
      s.type === 'preorder'
    );

    if (subscription) {
      this.subscriptionService.removeSubscription(subscription.id);
      this.isSubscribedToPreorder = false;
    }
  }

  unsubscribeRestock(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !this.book) return;

    const subscriptions = this.subscriptionService.getUserSubscriptions(user.username);
    const subscription = subscriptions.find(s =>
      s.bookId === this.book!.id &&
      s.type === 'restock'
    );

    if (subscription) {
      this.subscriptionService.removeSubscription(subscription.id);
      this.isSubscribedToRestock = false;
    }
  }

  addToCart(): void {
    if (this.book && this.book.status === 'available') {
      this.cartService.addToCart(this.book);
      alert(`Книга "${this.book.title}" добавлена в корзину`);
    }
  }
}
