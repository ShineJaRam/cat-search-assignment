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
  title = '😸 고양이 사진 갤러리 😻';
  altImage = 'https://t1.daumcdn.net/cfile/tistory/998FBA335C764C711D';

  showedCatInfos: CatInfo[] = [];
  savedCatInfos: CatInfo[] = [];

  catInfos$: Observable<CatInfo[]>;

  onDestroy = new Subject<void>();

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
      .subscribe(cats => {
        this.savedCatInfos = cats;
        this.showedCatInfos = cats;
      });
  }

  updateCatInfos(catLists: CatInfo[]): void {
    this.showedCatInfos = catLists;
  }

  updateSelectedCat(catName: string): void {
    if (catName !== '') {
      this.showedCatInfos = this.savedCatInfos.filter(cat =>
        cat.name.match(new RegExp(catName, 'i'))
      );
    } else {
      this.showedCatInfos = this.savedCatInfos;
    }
  }

  resetPage(): void {
    this.showedCatInfos = this.savedCatInfos;
  }
}
