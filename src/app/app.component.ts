import { Component, Inject, ChangeDetectorRef, OnDestroy, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BookListComponent, RouterLink, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'Книжный магазин';
  cartItemCount = 0;
  showLoginModal = false;
  loginData = { username: '', password: '', role: 'buyer' };
  loginError = '';
  currentUser: { username: string, role: string } | null = null;

  showSubscriptions = false;
  showCart = false;
  showOrders = false;
  showWarehouse = false;
  showNotifications = false;

  private userSubscription: Subscription;
  private cartSubscription: Subscription;

  constructor(
    private cartService: CartService,
    public authService: AuthService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    @Inject(DOCUMENT) private document: Document
  ) {
    cartService.getItems();
    this.cartSubscription = cartService.getCartItems$().subscribe(items => {
      this.cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });

    this.userSubscription = authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      if (user) {
        const isBuyer = user.role === 'buyer';
        const isSeller = user.role === 'seller';

        this.showCart = isBuyer;
        this.showOrders = isBuyer;
        this.showSubscriptions = isBuyer;
        this.showWarehouse = isSeller; 
      } else {
        this.showCart = false;
        this.showOrders = false;
        this.showSubscriptions = false;
        this.showWarehouse = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.cartSubscription?.unsubscribe();
  }
  getAriaChecked(role: string): string {
    return this.loginData.role === role ? 'true' : 'false';
  }
  openLogin(): void {
    this.showLoginModal = true;
    this.loginError = '';
    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
  }

  closeLogin(): void {
    this.showLoginModal = false;
    this.loginData = { username: '', password: '', role: 'buyer' };
    this.renderer.removeStyle(this.document.body, 'overflow');
  }

  onSubmitLogin(): void {
    if (this.authService.login(this.loginData.username, this.loginData.password, this.loginData.role)) {
      this.closeLogin();
    } else {
      this.loginError = 'Неверные учетные данные';
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
