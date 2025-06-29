import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<{ username: string, role: string } | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  getCurrentUser(): { username: string, role: string } | null {
    return this.currentUserSubject.value;
  }

  isSeller(): boolean {
    return this.currentUserSubject.value?.role === 'seller';
  }

  login(username: string, password: string, role: string): boolean {
    if (username && password && role) {
      const userData = { username, role };
      this.currentUserSubject.next(userData); 
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null); 
    localStorage.removeItem('currentUser');
  }

}
