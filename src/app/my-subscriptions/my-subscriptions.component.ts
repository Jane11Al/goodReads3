import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { SubscriptionService } from '../services/subscription.service';
import { AuthService } from '../services/auth.service';
import { Book, BookSubscription } from '../services/book.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-my-subscriptions',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './my-subscriptions.component.html',
  styleUrls: ['./my-subscriptions.component.css']
})
export class MySubscriptionsComponent implements OnInit {
  subscriptions: (BookSubscription & { book?: Book })[] = [];

  constructor(
    private subscriptionService: SubscriptionService,
    private bookService: BookService,
    private authService: AuthService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      const userSubs = this.subscriptionService.getUserSubscriptions(user.username);

      this.subscriptions = userSubs.map(sub => ({
        ...sub,
        book: this.bookService.getBookById(sub.bookId)
      })).filter(sub => sub.book); 
    }
  }

  unsubscribe(id: number): void {
    this.subscriptionService.removeSubscription(id);
    this.subscriptions = this.subscriptions.filter(sub => sub.id !== id);
  }

  getSubscriptionType(type: 'preorder' | 'restock'): string {
    return type === 'preorder' ? 'Предзаказ' : 'Уведомление о поступлении';
  }

  goToBookDetails(bookId: number): void {
    this.router.navigate(['/book', bookId]);
  }
}
