import { Component } from '@angular/core';
import { CartService, CartItem } from '../services/cart.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  items: CartItem[] = [];
  checkoutForm: FormGroup;
  orderSubmitted = false;
  orderDetails: any = null;

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    private router: Router,
    private orderService: OrderService
  ) {
    this.items = this.cartService.getItems();

    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5,6}$')]],
      paymentMethod: ['creditCard', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue]
    });
  }

  get totalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  get totalItems(): number {
    return this.cartService.getTotalCount();
  }

  submitOrder(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const formValue = this.checkoutForm.value;

    this.orderDetails = {
      id: Date.now(),
      date: new Date(),
      items: this.items,
      totalPrice: this.totalPrice,
      status: 'Обрабатывается',
      address: formValue.address,
      city: formValue.city,
      zipCode: formValue.zipCode,
      paymentMethod: formValue.paymentMethod,
      fullName: formValue.fullName,
      email: formValue.email,
      phone: formValue.phone
    };

    this.orderService.createOrder(this.orderDetails);
    this.cartService.clearCart();
    this.orderSubmitted = true;
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  getPaymentMethodName(method: string): string {
    switch (method) {
      case 'creditCard': return 'Кредитная карта';
      case 'paypal': return 'PayPal';
      case 'cash': return 'Наличными при получении';
      default: return method;
    }
  }
}
