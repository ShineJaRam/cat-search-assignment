import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { CatInfo } from '../../models';
import { CatsService } from '../../service/cats.service';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeWhile,
} from 'rxjs/operators';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit, OnDestroy {
  observableAlive = true;
  inputFormGroup: FormGroup;
  cats$?: Observable<CatInfo[]>;
  keywordSubscription$?: Subscription;
  isKeyword?: boolean;
  altImage = 'https://t1.daumcdn.net/cfile/tistory/998FBA335C764C711D';

  @Output() searchResult = new EventEmitter<CatInfo[]>();
  @ViewChild('formInput', { static: true }) formInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private catService: CatsService,
    formInput: ElementRef
  ) {
    this.inputFormGroup = this.fb.group({
      keyword: [''],
    });
    this.cats$ = this.inputFormGroup.get('keyword')?.valueChanges.pipe(
      takeWhile(() => this.observableAlive),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((keyword: string) => this.catService.searchCats(keyword))
    );
    this.formInput = formInput;
    this.keywordSubscription$ = this.cats$
      ?.pipe(
        takeWhile(() => this.observableAlive),
        map(cats => {
          return (
            cats.length === 0 &&
            this.inputFormGroup.get('keyword')?.value.length !== 0
          );
        })
      )
      .subscribe(result => (this.isKeyword = result));
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.observableAlive = false;
  }

  onSubmit(form: FormGroup): void {
    this.catService
      .searchCats(form.value.keyword)
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
      .subscribe(data => {
        this.searchResult.emit(data);
      });
  }

  selectText(): void {
    this.formInput.nativeElement.select();
  }
}
