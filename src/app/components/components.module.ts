import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchFormComponent } from './search-form/search-form.component';
import { RouterModule } from '@angular/router';
import { CardComponent } from './card/card.component';
import { CardListComponent } from './card-list/card-list.component';

@NgModule({
  declarations: [SearchFormComponent, CardComponent, CardListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: CardListComponent,
      },
    ]),
  ],
  providers: [],
})
export class ComponentsModule {}
