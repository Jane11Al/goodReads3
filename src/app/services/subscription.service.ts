import { Injectable } from '@angular/core';
import { BookSubscription } from './book.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly SUBSCRIPTIONS_KEY = 'book_subscriptions';
  private subscriptions: BookSubscription[] = [];

  constructor() {
    this.loadSubscriptions();
  }

  private loadSubscriptions(): void {
    const saved = localStorage.getItem(this.SUBSCRIPTIONS_KEY);
    if (saved) {
      try {
        this.subscriptions = JSON.parse(saved);
        this.subscriptions.forEach(sub => {
          if (typeof sub.createdAt === 'string') {
            sub.createdAt = new Date(sub.createdAt);
          }
        });
      } catch (e) {
        console.error('Error loading subscriptions:', e);
        this.subscriptions = [];
      }
    }
  }

  private saveSubscriptions(): void {
    localStorage.setItem(this.SUBSCRIPTIONS_KEY, JSON.stringify(this.subscriptions));
  }

  addSubscription(sub: BookSubscription): void {
    const exists = this.subscriptions.some(s =>
      s.username === sub.username &&
      s.bookId === sub.bookId &&
      s.type === sub.type
    );

    if (!exists) {
      if (!sub.id) sub.id = Date.now();
      if (!sub.createdAt) sub.createdAt = new Date();

      this.subscriptions.push(sub);
      this.saveSubscriptions();
    }
  }

  removeSubscription(id: number): void {
    this.subscriptions = this.subscriptions.filter(s => s.id !== id);
    this.saveSubscriptions();
  }

  getUserSubscriptions(username: string): BookSubscription[] {
    return this.subscriptions.filter(s => s.username === username);
  }

  getBookSubscriptions(bookId: number): BookSubscription[] {
    return this.subscriptions.filter(s => s.bookId === bookId);
  }

  isUserSubscribed(username: string, bookId: number, type?: 'preorder' | 'restock'): boolean {
    if (type) {
      return this.subscriptions.some(s =>
        s.username === username &&
        s.bookId === bookId &&
        s.type === type
      );
    }
    return this.subscriptions.some(s =>
      s.username === username &&
      s.bookId === bookId
    );
  }
}
