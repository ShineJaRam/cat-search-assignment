import { Component, Input, OnInit } from '@angular/core';
import { CatsService } from '../../service/cats.service';
import { CatInfo } from '../../models';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() catData: CatInfo;

  constructor() {
    this.catData = {
      id: '',
      name: '',
      image: {
        id: '',
        width: 0,
        height: 0,
        url: '',
      },
    };
  }

  ngOnInit(): void {}
}
