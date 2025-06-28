import { Injectable } from '@angular/core';
import { Book } from '../services/book.model';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs'; // Импортируем BehaviorSubject

export interface CartItem {
  book: Book;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: { [username: string]: CartItem[] } = {};
  private readonly CART_KEY = 'bookstore_cart';

  // Добавляем BehaviorSubject для реактивных обновлений
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  constructor(private authService: AuthService) {
    const savedCart = localStorage.getItem(this.CART_KEY);
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.updateCartSubject(); // Обновляем subject после загрузки
    }
  }

  // Правильная реализация Observable
  getCartItems$(): Observable<CartItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  private getCurrentUsername(): string | null {
    const user = this.authService.getCurrentUser();
    return user ? user.username : null;
  }

  private saveCart(): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.cartItems));
    this.updateCartSubject(); // Обновляем subject после сохранения
  }

  // Обновляем subject текущими данными
  private updateCartSubject(): void {
    const username = this.getCurrentUsername();
    const items = username ? this.cartItems[username] || [] : [];
    this.cartItemsSubject.next(items);
  }

  addToCart(book: Book, quantity: number = 1): void {
    const username = this.getCurrentUsername();
    if (!username) return;

    if (!this.cartItems[username]) {
      this.cartItems[username] = [];
    }

    const existingItem = this.cartItems[username].find(item => item.book.id === book.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems[username].push({ book, quantity });
    }

    this.saveCart();
  }

  removeFromCart(bookId: number): void {
    const username = this.getCurrentUsername();
    if (!username || !this.cartItems[username]) return;

    this.cartItems[username] = this.cartItems[username].filter(item => item.book.id !== bookId);
    this.saveCart();
  }

  updateQuantity(bookId: number, quantity: number): void {
    const username = this.getCurrentUsername();
    if (!username || !this.cartItems[username]) return;

    const item = this.cartItems[username].find(item => item.book.id === bookId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
    }
  }

  getItems(): CartItem[] {
    const username = this.getCurrentUsername();
    return username ? this.cartItems[username] || [] : [];
  }

  getTotalCount(): number {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.getItems().reduce((sum, item) =>
      sum + (item.book.price * item.quantity), 0);
  }

  clearCart(): void {
    const username = this.getCurrentUsername();
    if (!username) return;

    this.cartItems[username] = [];
    this.saveCart();
  }
}
