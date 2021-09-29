import { Component, OnDestroy, OnInit } from '@angular/core';
import { CatsService } from '../../service/cats.service';
import { CatInfo } from '../../models';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit, OnDestroy {
  cats: CatInfo[] = [];
  altImage = 'https://t1.daumcdn.net/cfile/tistory/998FBA335C764C711D';
  observableAlive = true;

  constructor(private catService: CatsService) {}

  ngOnInit(): void {
    this.getCatsList();
  }

  ngOnDestroy() {
    this.observableAlive = false;
  }

  getCatsList(): void {
    this.catService
      .getCats()
      .pipe(
        takeWhile(() => this.observableAlive),
        map(cats => {
          return cats.map<CatInfo>(cat => {
            return {
              ...cat,
              image: {
                ...cat.image,
                url: cat.image?.url ?? this.altImage,
              },
            };
          });
        })
      )
      .subscribe(cats => {
        return (this.cats = cats);
      });
  }

  getSearchResult(catLists: CatInfo[]): void {
    this.cats = catLists;
  }
}
