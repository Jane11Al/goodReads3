// my-subscriptions.component.ts
import { Component } from '@angular/core';
import { SubscriptionService } from '../services/subscription.service';
import { Book } from '../services/book.model';

@Component({
  selector: 'app-my-subscriptions',
  templateUrl: './my-subscriptions.component.html',
  styleUrls: ['./my-subscriptions.component.css']
})
export class MySubscriptionsComponent {
  subscriptions: Book[] = [];

  constructor(private subscriptionService: SubscriptionService) {
    this.subscriptions = this.subscriptionService.getSubscriptions();
  }

  removeSubscription(bookId: number): void {
    this.subscriptionService.removeSubscription(bookId);
    this.subscriptions = this.subscriptions.filter(book => book.id !== bookId);
  }
}
