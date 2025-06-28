import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { Book, Author, Publisher, Genre } from '../services/book.model';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule] 
})

export class WarehouseComponent implements OnInit {
  books: Book[] = [];
  showAddBookModal = false;
  bookForm: FormGroup;
  statuses = ['available', 'out_of_stock', 'preorder'];
  selectedBook: Book | null = null;
  isEditing = false;
  authors: Author[] = [];
  showNotification = false;
  publishers: Publisher[] = [];
  genres: Genre[] = [];

  constructor(
    private bookService: BookService,
    private fb: FormBuilder
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      authorIds: [[], Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      status: ['available', Validators.required],
      // Добавьте остальные поля
      description: [''],
      imageUrl: [''],
      publisherId: [1],
      genreId: [[]],
      isbn: [''],
      year: [new Date().getFullYear()]
    });
  }

  ngOnInit(): void {
    this.loadBooks();
    this.loadAuthors();
    this.loadPublishers();
    this.loadGenres();
  }

  loadBooks(): void {
    this.books = [...this.bookService.getAllBooks()];
  }

  loadAuthors(): void {
    this.authors = this.bookService.getAllAuthors();
  }

  loadPublishers(): void {
    this.publishers = this.bookService.getAllPublishers();
  }

  loadGenres(): void {
    this.genres = this.bookService.getAllGenres();
  }

  openAddBookModal(): void {
    this.isEditing = false;
    this.selectedBook = null;
    this.bookForm.reset({
      title: '',
      authorIds: [],
      price: '',
      stock: 0,
      status: 'available',
      description: '',
      imageUrl: 'assets/default-book.jpg',
      publisherId: 1,
      genreId: [],
      isbn: '',
      year: new Date().getFullYear()
    });
    this.showAddBookModal = true;
  }

  openEditBookModal(book: Book): void {
    this.isEditing = true;
    this.selectedBook = book;
    this.bookForm.patchValue({
      title: book.title,
      authorIds: book.authorId,
      price: book.price,
      stock: book.stock,
      status: book.status,
      description: book.description,
      imageUrl: book.imageUrl,
      publisherId: book.publisherId,
      genreId: book.genreId,
      isbn: book.isbn,
      year: book.year
    });
    this.showAddBookModal = true;
  }

  closeModal(): void {
    this.showAddBookModal = false;
  }

  addOrUpdateBook(): void {
    if (this.bookForm.invalid) {
      console.error('Форма невалидна', this.bookForm.errors);
      return;
    }

    const formValue = this.bookForm.value;
    console.log('Данные формы:', formValue);

    if (this.isEditing && this.selectedBook) {
      const updatedBook: Book = {
        ...this.selectedBook,
        ...formValue,
        authorId: formValue.authorIds
      };
      this.bookService.updateBook(updatedBook);
      console.log('Книга обновлена:', updatedBook);
    } else {
      const newBook: Book = {
        id: Date.now(),
        title: formValue.title,
        authorId: formValue.authorIds,
        price: formValue.price,
        stock: formValue.stock,
        status: formValue.status,
        description: formValue.description,
        imageUrl: formValue.imageUrl || 'assets/default-book.jpg',
        publisherId: formValue.publisherId,
        genreId: formValue.genreId,
        isbn: formValue.isbn,
        year: formValue.year
      };
      this.bookService.addBook(newBook);
      console.log('Новая книга добавлена:', newBook);
    }

    this.loadBooks();
    this.closeModal();
    this.showNotification = true;
    setTimeout(() => this.showNotification = false, 2000);
  }

  saveBook(book: Book): void {
    this.bookService.updateBook(book);
    this.showNotification = true;
    setTimeout(() => this.showNotification = false, 2000);
  }

  getAuthorsForBook(bookId: number): string {
    return this.bookService.getAuthorsForBook(bookId).join(', ');
  }

  deleteBook(bookId: number): void {
    this.bookService.deleteBook(bookId);
    this.loadBooks();
  }

  getStatusName(status: string): string {
    switch (status) {
      case 'available': return 'В наличии';
      case 'out_of_stock': return 'Нет в наличии';
      case 'preorder': return 'Предзаказ';
      default: return status;
    }
  }
}
/*
export class WarehouseComponent implements OnInit {
  showNotification = false;
  books: Book[] = [];
  showAddBookModal = false;
  bookForm: FormGroup;
  statuses = ['available', 'out_of_stock', 'preorder'];
  selectedBook: Book | null = null;
  isEditing = false;
  authors: Author[] = [];

  constructor(
    private bookService: BookService,
    private fb: FormBuilder,

  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      authorIds: [[], Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      status: ['available', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBooks();
    this.loadAuthors();
  }

  loadBooks(): void {
    this.books = this.bookService.getAllBooks();
  }

  loadAuthors(): void {
    this.authors = this.bookService.getAllAuthors();
  }

  openAddBookModal(): void {
    this.isEditing = false;
    this.selectedBook = null;
    this.bookForm.reset({
      title: '',
      authorIds: [],
      price: '',
      stock: 0,
      status: 'available'
    });
    this.showAddBookModal = true;
  }

  openEditBookModal(book: Book): void {
    this.isEditing = true;
    this.selectedBook = book;
    this.bookForm.patchValue({
      title: book.title,
      authorIds: book.authorId,
      price: book.price,
      stock: book.stock,
      status: book.status
    });
    this.showAddBookModal = true;
  }

  closeModal(): void {
    this.showAddBookModal = false;
  }

  addOrUpdateBook(): void {
    if (this.bookForm.invalid) return;

    const formValue = this.bookForm.value;

    if (this.isEditing && this.selectedBook) {
      const updatedBook: Book = {
        ...this.selectedBook,
        title: formValue.title,
        authorId: formValue.authorIds,
        price: formValue.price,
        stock: formValue.stock,
        status: formValue.status
      };
      this.bookService.updateBook(updatedBook);
    } else {
      const newBook: Book = {
        id: Date.now(),
        title: formValue.title,
        authorId: formValue.authorIds,
        price: formValue.price,
        stock: formValue.stock,
        status: formValue.status,
        description: 'Описание отсутствует',
        imageUrl: 'assets/default-book.jpg',
        publisherId: 1,
        genreId: [1],
        isbn: '000-0000000000',
        year: new Date().getFullYear()
      };
      this.bookService.addBook(newBook);
    }

    this.loadBooks();
    this.closeModal();
  }

  // Исправленные методы с обработкой события
  updateBookStock(bookId: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newStock = parseInt(inputElement.value, 10);
    if (!isNaN(newStock)) {
      this.bookService.updateBookStock(bookId, newStock);
      this.loadBooks();
    }
  }

  // Добавьте метод для получения имен авторов
  getAuthorsForBook(bookId: number): string {
    return this.bookService.getAuthorsForBook(bookId).join(', ');
  }
  updateBookStatus(bookId: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newStatus = selectElement.value;
    this.bookService.updateBookStatus(bookId, newStatus);
    this.loadBooks();
  }

  deleteBook(bookId: number): void {
    this.bookService.deleteBook(bookId);
    this.loadBooks();
  }

  getStatusName(status: string): string {
    switch (status) {
      case 'available': return 'В наличии';
      case 'out_of_stock': return 'Нет в наличии';
      case 'preorder': return 'Предзаказ';
      default: return status;
    }
  }
  saveBook(book: Book): void {
    this.bookService.updateBook(book);

    // Показываем уведомление
    this.showNotification = true;

    // Устанавливаем таймер для скрытия уведомления
    setTimeout(() => {
      this.showNotification = false;
    }, 2000);

    // Обновляем статус (теперь метод public)
    this.bookService.checkStockStatus(book.id);
  }
}
*/
