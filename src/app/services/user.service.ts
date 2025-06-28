import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser = new BehaviorSubject<User | null>(null);
  private subscriptions: { [username: string]: { bookId: number, type: string }[] } = {};

  setCurrentUser(user: User | null): void {
    this.currentUser.next(user);
  }

  constructor() {
    const savedSubs = localStorage.getItem('subscriptions');
    if (savedSubs) this.subscriptions = JSON.parse(savedSubs);
  }

  subscribeToNotification(username: string, bookId: number, type: string): void {
    if (!this.subscriptions[username]) {
      this.subscriptions[username] = [];
    }

    this.subscriptions[username].push({ bookId, type });
    localStorage.setItem('subscriptions', JSON.stringify(this.subscriptions));
  }

  getSubscriptions(username: string): { bookId: number, type: string }[] {
    return this.subscriptions[username] || [];
  }
  unsubscribe(username: string, bookId: number, type: string): void {
    if (this.subscriptions[username]) {
      this.subscriptions[username] = this.subscriptions[username].filter(
        sub => !(sub.bookId === bookId && sub.type === type)
      );
      localStorage.setItem('subscriptions', JSON.stringify(this.subscriptions));
    }
  }
  notifySubscribers(bookId: number, changeType: string): void {
    Object.keys(this.subscriptions).forEach(username => {
      const userSubs = this.subscriptions[username].filter(sub =>
        sub.bookId === bookId && sub.type === changeType
      );

      if (userSubs.length > 0) {
        console.log(`Уведомление для ${username}: Книга изменила статус`);
        this.subscriptions[username] = this.subscriptions[username].filter(
          sub => !(sub.bookId === bookId && sub.type === changeType)
        );
        localStorage.setItem('subscriptions', JSON.stringify(this.subscriptions));
      }
    });
  }
}
