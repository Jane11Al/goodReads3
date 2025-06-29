// book-list.component.ts
import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { Book, Author, BookSubscription } from '../services/book.model';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../services/cart.service';
import { SubscriptionService } from '../services/subscription.service';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = this.bookService.getAllBooks();

  constructor(
    private bookService: BookService,
    private router: Router,
    private cartService: CartService,
    private subscriptionService: SubscriptionService,
    private authService: AuthService 
  ) { }

  getAuthorNames(authorId: number[] | undefined): string {
    if (!authorId || authorId.length === 0) {
      return 'Автор неизвестен';
    }

    return authorId.map(id => {
      const author = this.bookService.getAuthorById(id);
      return author ? author.fullName : 'Неизвестный автор';
    }).join(', ');
  }
  ngOnInit(): void {
    this.books = this.bookService.getAllBooks();
  }
  subscribeToBook(book: Book, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      alert('Пожалуйста, войдите в систему, чтобы подписаться на уведомления');
      return;
    }

    // Определяем тип подписки на основе статуса книги
    let subscriptionType: 'preorder' | 'restock' | null = null;

    if (book.status === 'coming_soon' || book.status === 'preorder') {
      subscriptionType = 'preorder';
    } else if (book.status === 'out_of_stock') {
      subscriptionType = 'restock';
    }

    if (!subscriptionType) {
      alert('Подписка для этой книги недоступна');
      return;
    }

    // Создаем новую подписку
    const newSubscription: BookSubscription = {
      id: Date.now(), // Используем timestamp как уникальный ID
      username: user.username,
      bookId: book.id,
      type: subscriptionType,
      createdAt: new Date(),
      notified: false
    };

    // Добавляем подписку через сервис
    this.subscriptionService.addSubscription(newSubscription);

    // Уведомляем пользователя
    alert(`Вы подписались на уведомления о книге "${book.title}"`);

    // Обновляем состояние подписки (если нужно)
    // Для мгновенного обновления UI вам может понадобиться обновить состояние
  }

  isSubscribed(bookId: number): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;

    return this.subscriptionService.isUserSubscribed(user.username, bookId);
  }
  goToBookDetails(bookId: number): void {
    this.router.navigate(['/book', bookId]);
  }

  getAuthorName(authorId: number): string {
    return this.bookService.getAuthorById(authorId)?.fullName || 'Неизвестный автор';
  }

  shortenDescription(desc: string): string {
    return desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
  }
  addToCart(book: Book, event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(book);
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/place-holder.jpg';
  }


  getStatusText(status: string): string {
    switch (status) {
      case 'available': return 'В наличии';
      case 'out_of_stock': return 'Нет в наличии';
      case 'preorder': return 'Предзаказ';
      default: return status;
    }
  }
}
