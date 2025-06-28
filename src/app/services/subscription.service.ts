import { Injectable } from '@angular/core';
import { Book } from './book.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly SUBSCRIPTIONS_KEY = 'book_subscriptions';
  private subscriptions: Book[] = [];

  constructor() {
    this.loadSubscriptions();
  }

  // Загрузить подписки из localStorage
  private loadSubscriptions(): void {
    const savedSubs = localStorage.getItem(this.SUBSCRIPTIONS_KEY);
    if (savedSubs) {
      try {
        this.subscriptions = JSON.parse(savedSubs);
      } catch (e) {
        console.error('Ошибка при загрузке подписок:', e);
        this.subscriptions = [];
      }
    }
  }

  // Сохранить подписки в localStorage
  private saveSubscriptions(): void {
    localStorage.setItem(this.SUBSCRIPTIONS_KEY, JSON.stringify(this.subscriptions));
  }

  // Добавить подписку
  addSubscription(book: Book): void {
    // Проверяем, нет ли уже такой подписки
    if (!this.subscriptions.some(sub => sub.id === book.id)) {
      this.subscriptions.push(book);
      this.saveSubscriptions();
    }
  }

  // Удалить подписку
  removeSubscription(bookId: number): void {
    this.subscriptions = this.subscriptions.filter(book => book.id !== bookId);
    this.saveSubscriptions();
  }

  // Получить все подписки
  getSubscriptions(): Book[] {
    return [...this.subscriptions];
  }

  // Проверить, подписан ли пользователь на книгу
  isSubscribed(bookId: number): boolean {
    return this.subscriptions.some(book => book.id === bookId);
  }
}
