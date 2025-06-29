// app.routes.ts
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { AuthGuard } from './auth.guard';
import { MySubscriptionsComponent } from './my-subscriptions/my-subscriptions.component';
import { NotificationsComponent } from './notifications/notifications.component';


export const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'book/:id', component: BookDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'warehouse', component: WarehouseComponent },
  
  { path: 'my-subscriptions', component: MySubscriptionsComponent },
  {
    path: 'warehouse',
    component: WarehouseComponent,
    canActivate: [AuthGuard],
    data: { role: 'seller' }
  },
  { path: '**', redirectTo: '' }
];
