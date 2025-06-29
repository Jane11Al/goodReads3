import { Injectable } from '@angular/core';
import { Book, Author, Publisher, Genre } from '../services/book.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: Book[] = [];
  private authors: Author[] = []; 
  private publishers: Publisher[] = []; 
  private genres: Genre[] = [];

  private readonly BOOKS_KEY = 'bookstore_books';
  private readonly AUTHORS_KEY = 'bookstore_authors';
  private readonly PUBLISHERS_KEY = 'bookstore_publishers';
  private readonly GENRES_KEY = 'bookstore_genres';

  constructor(private userService: UserService) {
    this.loadAllData();
  }

  private saveBooks(): void {
    localStorage.setItem(this.BOOKS_KEY, JSON.stringify(this.books));
  }
  private loadAllData(): void {
    const savedBooks = localStorage.getItem(this.BOOKS_KEY);
    const savedAuthors = localStorage.getItem(this.AUTHORS_KEY);
    const savedPublishers = localStorage.getItem(this.PUBLISHERS_KEY);
    const savedGenres = localStorage.getItem(this.GENRES_KEY);

    if (savedBooks) this.books = JSON.parse(savedBooks);
    if (savedAuthors) this.authors = JSON.parse(savedAuthors);
    if (savedPublishers) this.publishers = JSON.parse(savedPublishers);
    if (savedGenres) this.genres = JSON.parse(savedGenres);

    if (!savedBooks || !savedAuthors || !savedPublishers || !savedGenres) {
      this.initializeDefaultData();
      this.saveAllData();
    }
  }

  private initializeDefaultData(): void {
    this.books = [
      {
        id: 1,
        title: 'Мастер и Маргарита',
        description: 'Классика русской литературы, философский роман',
        price: 560,
        imageUrl: 'assets/mim.jpg',
        authorId: [1],
        publisherId: 1,
        genreId: [1],
        stock: 10,
        status: 'available',
        isbn: '978-5-699-12014-7',
        year: 1967
      },
      {
        id: 2,
        title: '1984',
        description: 'Антиутопия о тоталитарном обществе',
        price: 720,
        imageUrl: 'assets/1984.jpg',
        authorId: [2],
        publisherId: 2,
        genreId: [2],
        stock: 10,
        status: 'available',
        isbn: '978-5-17-099326-0',
        year: 1949
      },
      {
        id: 3,
        title: 'Преступление и наказание',
        description: 'Психологический роман о нравственных терзаниях убийцы',
        price: 450,
        imageUrl: 'assets/crime.jpg',
        authorId: [3],
        publisherId: 3,
        status: 'available',
        genreId: [1, 3],
        isbn: '978-5-04-106298-3',
        stock: 10,
        year: 1866
      },
      {
        id: 4,
        title: 'Гарри Поттер и философский камень',
        description: 'Первая книга о юном волшебнике Гарри Поттере',
        price: 890,
        imageUrl: 'assets/harry.jpg',
        authorId: [4],
        publisherId: 4,
        stock: 10,
        status: 'available',
        genreId: [4, 5],
        isbn: '978-5-389-07435-4',
        year: 1997
      },
      {
        id: 5,
        title: 'Война и мир',
        description: 'Эпопея о войне 1812 года и судьбах русских аристократов',
        price: 680,
        imageUrl: 'assets/warpeace.jpg',
        authorId: [5],
        status: 'available',
        publisherId: 5,
        stock: 10,
        genreId: [1, 6],
        isbn: '978-5-17-112060-3',
        year: 1869
      },
      {
        id: 6,
        title: 'Три товарища',
        description: 'Роман о дружбе и любви в послевоенной Германии',
        price: 520,
        imageUrl: 'assets/threecomrades.jpg',
        authorId: [6],
        status: 'available',
        stock: 10,
        publisherId: 6,
        genreId: [1, 7],
        isbn: '978-5-17-087885-9',
        year: 1936
      },
      {
        id: 7,
        title: 'Убить пересмешника',
        description: 'История о расовой несправедливости в американском южном городке',
        price: 610,
        imageUrl: 'assets/mockingbird.jpg',
        authorId: [7],
        publisherId: 7,
        status: 'available',
        stock: 10,
        genreId: [8],
        isbn: '978-5-17-099417-5',
        year: 1960
      },
      {
        id: 8,
        title: 'Маленький принц',
        description: 'Философская сказка-притча для детей и взрослых',
        price: 380,
        imageUrl: 'assets/prince.jpg',
        authorId: [8],
        publisherId: 8,
        genreId: [9, 10],
        status: 'available',
        stock: 10,
        isbn: '978-5-699-68661-3',
        year: 1943
      },
      {
        id: 9,
        title: 'Анна Каренина',
        description: 'Трагическая история любви замужней женщины',
        price: 590,
        imageUrl: 'assets/anna.jpg',
        authorId: [5],
        publisherId: 5,
        status: 'available',
        stock: 10,
        genreId: [1],
        isbn: '978-5-04-103999-2',
        year: 1877
      },
      {
        id: 10,
        title: 'Сто лет одиночества',
        description: 'Магический реализм о семье Буэндиа и городе Макондо',
        price: 730,
        imageUrl: 'assets/solitude.jpg',
        authorId: [9],
        status: 'available',
        publisherId: 9,
        stock: 10,
        genreId: [11, 1],
        isbn: '978-5-17-090084-3',
        year: 1967
      },
      {
        id: 11,
        title: 'Тёмные начала',
        description: 'Фэнтезийная трилогия о параллельных мирах и частицах Пыли',
        price: 850,
        imageUrl: 'assets/hisdarkmaterials.jpg',
        authorId: [10],
        publisherId: 10,
        stock: 10,
        genreId: [4, 5],
        status: 'available',
        isbn: '978-5-17-090635-7',
        year: 1995
      },
      {
        id: 12,
        title: 'Шерлок Холмс: Собака Баскервилей',
        description: 'Знаменитый детектив о призрачной собаке и семейном проклятии',
        price: 490,
        imageUrl: 'assets/hound.jpg',
        authorId: [11],
        publisherId: 11,
        stock: 10,
        status: 'available',
        genreId: [12],
        isbn: '978-5-17-112083-2',
        year: 1902
      }
    ];
    this.authors = [
      { id: 1, fullName: 'Михаил Булгаков' },
      { id: 2, fullName: 'Джордж Оруэлл' },
      { id: 3, fullName: 'Фёдор Достоевский' },
      { id: 4, fullName: 'Джоан Роулинг' },
      { id: 5, fullName: 'Лев Толстой' },
      { id: 6, fullName: 'Эрих Мария Ремарк' },
      { id: 7, fullName: 'Харпер Ли' },
      { id: 8, fullName: 'Антуан де Сент-Экзюпери' },
      { id: 9, fullName: 'Габриэль Гарсиа Маркес' },
      { id: 10, fullName: 'Филип Пулман' },
      { id: 11, fullName: 'Артур Конан Дойл' }
    ];
    this.publishers = [
      { id: 1, name: 'АСТ' },
      { id: 2, name: 'Эксмо' },
      { id: 3, name: 'Речь' },
      { id: 4, name: 'Махаон' },
      { id: 5, name: 'Азбука' },
      { id: 6, name: 'Фолио' },
      { id: 7, name: 'Иностранка' },
      { id: 8, name: 'Эксмо-Пресс' },
      { id: 9, name: 'Corpus' },
      { id: 10, name: 'Росмэн' },
      { id: 11, name: 'Нигма' }
    ];

    this.genres = [
      { id: 1, name: 'Классика' }, 
      { id: 2, name: 'Антиутопия' },
      { id: 3, name: 'Психологический' },
      { id: 4, name: 'Фэнтези' },
      { id: 5, name: 'Приключения' },
      { id: 6, name: 'Исторический' },
      { id: 7, name: 'Драма' },
      { id: 8, name: 'Социальный' },
      { id: 9, name: 'Философский' },
      { id: 10, name: 'Сказка' },
      { id: 11, name: 'Магический реализм' },
      { id: 12, name: 'Детектив' }
    ];
  }
  private saveAllData(): void {
    localStorage.setItem(this.BOOKS_KEY, JSON.stringify(this.books));
    localStorage.setItem(this.AUTHORS_KEY, JSON.stringify(this.authors));
    localStorage.setItem(this.PUBLISHERS_KEY, JSON.stringify(this.publishers));
    localStorage.setItem(this.GENRES_KEY, JSON.stringify(this.genres));
  }

  private getNextId(items: any[]): number {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
  }

  addBook(book: Book): void {
    if (!book.id) {
      book.id = this.getNextId(this.books);
    }

    this.books.push(book);
    this.saveAllData();
    this.checkStockStatus(book.id);
  }

  deleteBook(bookId: number): void {
    this.books = this.books.filter(book => book.id !== bookId);
    this.saveAllData();
  }

  addAuthor(author: Author): void {
    if (!author.id) {
      author.id = this.getNextId(this.authors);
    }
    this.authors.push(author);
    this.saveAllData();
  }

  addPublisher(publisher: Publisher): void {
    if (!publisher.id) {
      publisher.id = this.getNextId(this.publishers);
    }
    this.publishers.push(publisher);
    this.saveAllData();
  }

  addGenre(genre: Genre): void {
    if (!genre.id) {
      genre.id = this.getNextId(this.genres);
    }
    this.genres.push(genre);
    this.saveAllData();
  }

  updateBookStock(bookId: number, newStock: number): void {
    const book = this.getBookById(bookId);
    if (book) {
      book.stock = newStock;
      this.saveAllData();
      this.checkStockStatus(bookId);
    }
  }

  public checkStockStatus(bookId: number): void {
    const book = this.getBookById(bookId);
    if (!book) return;

    const oldStatus = book.status;

    if (book.stock > 0 && book.status === 'out_of_stock') {
      book.status = 'available';
    } else if (book.stock <= 0 && book.status === 'available') {
      book.status = 'out_of_stock';
    }
    if (oldStatus !== book.status) {
      this.saveAllData();
    }
  }

  getAllBooks(): Book[] {
    return this.books;
  }

  getBookById(id: number): Book | undefined {
    return this.books.find(book => book.id === id);
  }

  getAllAuthors(): Author[] {
    return this.authors;
  }

  getAllPublishers(): Publisher[] {
    return this.publishers;
  }

  getAllGenres(): Genre[] {
    return this.genres;
  }

  getPublisherById(id: number): Publisher | undefined {
    return this.publishers.find(p => p.id === id);
  }

  getGenreById(id: number): Genre | undefined {
    return this.genres.find(g => g.id === id);
  }

  getAuthorNames(authorIds: number[]): string {
    if (!authorIds || authorIds.length === 0) return 'Автор не указан';

    return authorIds
      .map(id => {
        const author = this.authors.find(a => a.id === id);
        return author ? author.fullName : 'Неизвестный автор';
      })
      .join(', ');
  }

  getAuthorsForBook(bookId: number): string[] {
    const book = this.getBookById(bookId);
    if (!book || !book.authorId || book.authorId.length === 0) {
      return ['Автор неизвестен'];
    }

    return book.authorId.map(authorId => {
      const author = this.getAuthorById(authorId);
      return author ? author.fullName : 'Неизвестный автор';
    });
  }

  getAuthorById(id: number): Author | undefined {
    return this.authors.find(a => a.id === id);
  }

  getGenresForBook(bookId: number): string[] {
    const book = this.getBookById(bookId);
    if (!book || !book.genreId || book.genreId.length === 0) {
      return ['Жанр не определен'];
    }

    return book.genreId.map(genreId => {
      const genre = this.getGenreById(genreId);
      return genre?.name || 'Неизвестный жанр';
    });
  }

  updateBook(updatedBook: Book): void {
    const index = this.books.findIndex(book => book.id === updatedBook.id);
    if (index !== -1) {
      this.books[index] = updatedBook;
      this.saveAllData(); // Используем единый метод сохранения
      this.checkStockStatus(updatedBook.id);
    }
  }

  updateBookStatus(bookId: number, newStatus: string): void {
    const book = this.getBookById(bookId);
    if (book) {
      book.status = newStatus;
      this.saveAllData(); // Используем единый метод сохранения
    }
  }
}
