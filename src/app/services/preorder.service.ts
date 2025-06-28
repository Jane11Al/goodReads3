import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreorderService {
  private apiUrl = 'https://your-api-url/api/preorders';

  constructor(private http: HttpClient) { }

  getUserSubscriptions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user-subscriptions`);
  }

  toggleSubscription(bookId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/toggle-subscription`, { bookId });
  }

  getBookSubscribers(bookId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/book-subscribers/${bookId}`);
  }
}
