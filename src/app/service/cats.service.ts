import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatInterface } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CatsService {
  private url = 'https://api.thecatapi.com/v1/breeds';
  constructor(private http: HttpClient) {}

  getCats(): Observable<CatInterface[]> {
    return this.http.get<CatInterface[]>(this.url);
  }
}
