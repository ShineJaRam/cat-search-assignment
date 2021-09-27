import { Component, Input, OnInit } from '@angular/core';
import { CatsService } from '../../service/cats.service';
import { CatInterface } from '../../models';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() catData: CatInterface = {};

  constructor() {}

  ngOnInit(): void {}
}
