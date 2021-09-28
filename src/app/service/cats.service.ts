import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CatInfo } from '../models';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CatsService {
  private url = 'https://api.thecatapi.com/v1/breeds';

  constructor(private http: HttpClient) {}

  getCats(): Observable<CatInfo[]> {
    return this.http.get<CatInfo[]>(this.url);
  }

  searchCats(keyword: string): Observable<CatInfo[]> {
    if (!keyword.trim()) {
      return of([]);
    }

    return this.http
      .get<CatInfo[]>(`${this.url}/search?q=${keyword}`)
      .pipe(tap(console.log));
  }
}
