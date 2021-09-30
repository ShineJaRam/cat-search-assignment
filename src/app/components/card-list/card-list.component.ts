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
  showedCatInfos: CatInfo[] = [];
  savedCatInfos: CatInfo[] = [];
  altImage = 'https://t1.daumcdn.net/cfile/tistory/998FBA335C764C711D';
  onDestroy = new Subject<void>();
  catInfos$: Observable<CatInfo[]>;

  constructor(private catService: CatsService) {
    this.catInfos$ = this.catService.getCats();
  }

  ngOnInit(): void {
    this.getCatsList();
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  getCatsList(): void {
    this.catInfos$
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
      .subscribe(
        cats => ((this.savedCatInfos = cats), (this.showedCatInfos = cats))
      );
  }

  updateCatInfos(catLists: CatInfo[]): void {
    this.showedCatInfos = catLists;
  }

  updateSelectedCat(catName: string): void {
    this.showedCatInfos = this.savedCatInfos.filter(
      cat => cat.name === catName
    );
  }
}
