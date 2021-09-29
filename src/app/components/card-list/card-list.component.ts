import { Component, OnDestroy, OnInit } from '@angular/core';
import { CatsService } from '../../service/cats.service';
import { CatInfo } from '../../models';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit, OnDestroy {
  cats: CatInfo[] = [];
  altImage = 'https://t1.daumcdn.net/cfile/tistory/998FBA335C764C711D';
  onDestroy = new Subject<void>();
  getCats: Observable<CatInfo[]>;

  constructor(private catService: CatsService) {
    this.getCats = this.catService.getCats();
  }

  ngOnInit(): void {
    this.getCatsList();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  getCatsList(): void {
    this.getCats
      .pipe(
        map(cats =>
          cats.map<CatInfo>(cat => ({
            ...cat,
            image: {
              ...cat.image,
              url: cat.image?.url ?? this.altImage,
            },
          }))
        ),
        takeUntil(this.onDestroy)
      )
      .subscribe(cats => (this.cats = cats));
  }

  getSearchResult(catLists: CatInfo[]): void {
    this.cats = catLists;
  }
}
