// order.service.ts
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export interface Order {
  id: number;
  date: Date;
  items: any[];
  totalPrice: number;
  status: string;
  address: string;
  paymentMethod: string;
  customerName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: { [username: string]: Order[] } = {};
  private readonly ORDERS_KEY = 'bookstore_orders';

  constructor(private authService: AuthService) { // Добавляем AuthService
    const savedOrders = localStorage.getItem(this.ORDERS_KEY);
    if (savedOrders) {
      this.orders = JSON.parse(savedOrders);
    }
  }

  private getCurrentUsername(): string | null {
    const user = this.authService.getCurrentUser();
    return user ? user.username : null;
  }

  private saveOrders(): void {
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(this.orders));
  }

  createOrder(order: Order): void {
    const username = this.getCurrentUsername();
    if (!username) return;

    if (!this.orders[username]) {
      this.orders[username] = [];
    }

    this.orders[username].push(order);
    this.saveOrders();
  }

  getOrders(): Order[] {
    const username = this.getCurrentUsername();
    return username ? this.orders[username] || [] : [];
  }

  getOrderById(id: number): Order | undefined {
    const username = this.getCurrentUsername();
    if (!username || !this.orders[username]) return undefined;

    return this.orders[username].find(order => order.id === id);
  }

  updateOrderStatus(id: number, status: string): void {
    const username = this.getCurrentUsername();
    if (!username || !this.orders[username]) return;

    const order = this.orders[username].find(o => o.id === id);
    if (order) {
      order.status = status;
      this.saveOrders();
    }
  }
}
