export interface Book {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  authorId: number[]; 
  publisherId: number;
  genreId: number[];
  stock: number;
  status: string,
  isbn: string;
  year: number;
}

export interface Author {
  id: number;
  fullName: string;
}

export interface Publisher {
  id: number;
  name: string;
}

export interface Genre {
  id: number;
  name: string;
}
