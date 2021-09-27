import { Component, OnInit } from '@angular/core';
import { CatsService } from '../../service/cats.service';
import { CatInterface } from '../../models';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit {
  cats: CatInterface[] = [];

  constructor(private catService: CatsService) {}

  ngOnInit(): void {
    this.getCatsList();
  }

  getCatsList(): void {
    this.catService
      .getCats()
      .pipe(tap(console.log))
      .subscribe(cats => (this.cats = cats));
  }
}
