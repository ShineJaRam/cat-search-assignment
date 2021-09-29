import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CatInfo } from '../../models';
import { CatsService } from '../../service/cats.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  inputFormGroup: FormGroup;
  cats$?: Observable<CatInfo[]>;

  // isKeyword?: boolean = this.cats$?.subscribe(cats => {
  //   return cats.length === 0 &&
  //     this.inputFormGroup.get('keyword')?.value.length !== 0;
  // });

  @Output() searchResult = new EventEmitter<CatInfo[]>();

  constructor(private fb: FormBuilder, private catService: CatsService) {
    this.inputFormGroup = this.fb.group({
      keyword: [''],
    });
    this.cats$ = this.inputFormGroup.get('keyword')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((keyword: string) => this.catService.searchCats(keyword))
    );
  }

  ngOnInit(): void {
    this.cats$?.subscribe(cats => console.log(cats.length));
  }

  onSubmit(form: FormGroup): void {
    this.catService.searchCats(form.value.keyword).subscribe(data => {
      this.searchResult.emit(data);
    });
  }
}
