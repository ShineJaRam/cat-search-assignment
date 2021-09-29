import { Component, OnInit } from '@angular/core';
import { CatsService } from '../../service/cats.service';
import { CatInfo } from '../../models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit {
  cats: CatInfo[] = [];
  altImage = 'https://t1.daumcdn.net/cfile/tistory/998FBA335C764C711D';

  constructor(private catService: CatsService) {}

  ngOnInit(): void {
    this.getCatsList();
  }

  getCatsList(): void {
    this.catService
      .getCats()
      .pipe(
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
