import { Component } from '@angular/core';
import { CartService, CartItem } from '../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookService } from '../services/book.service'; // Добавим импорт BookService

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  items: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private bookService: BookService // Добавим BookService
  ) {
    this.items = this.cartService.getItems();
  }

  getAuthorNames(authorId: number[]): string {
    return this.bookService.getAuthorNames(authorId);
  }

  // Остальные методы без изменений
  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) {
      quantity = 1;
    }
    this.cartService.updateQuantity(item.book.id, quantity);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.book.id);
    this.items = this.cartService.getItems();
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  getTotalCount(): number {
    return this.cartService.getTotalCount();
  }
}
