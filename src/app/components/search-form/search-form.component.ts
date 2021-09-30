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
import { Observable, of, Subject, Subscription } from 'rxjs';
import { CatInfo } from '../../models';
import { CatsService } from '../../service/cats.service';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit, OnDestroy {
  @Output() searchResult = new EventEmitter<CatInfo[]>();
  @ViewChild('formInput', { static: true })
  formInput: ElementRef<HTMLInputElement>;

  inputFormGroup: FormGroup;
  cats$ = of<CatInfo[]>([]);
  keywordSubscription?: Subscription;
  hasNoKeyword: boolean;
  altImage = 'https://t1.daumcdn.net/cfile/tistory/998FBA335C764C711D';
  onDestroy = new Subject<void>();
  searchCat: (value: string) => Observable<CatInfo[]>;

  constructor(
    private formBuilder: FormBuilder,
    private catService: CatsService,
    formInput: ElementRef<HTMLInputElement>
  ) {
    this.hasNoKeyword = false;
    this.inputFormGroup = this.formBuilder.group({
      keyword: [''],
    });
    this.cats$ = this.inputFormGroup.controls['keyword'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((keyword: string) => this.catService.searchCats(keyword)),
      takeUntil(this.onDestroy)
    );
    this.formInput = formInput;
    this.keywordSubscription = this.cats$
      .pipe(
        map(
          cats =>
            cats.length === 0 &&
            this.inputFormGroup.controls['keyword'].value.length !== 0
        ),
        takeUntil(this.onDestroy)
      )
      .subscribe(result => (this.hasNoKeyword = result));
    this.searchCat = (value: string) => this.catService.searchCats(value);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  onSubmit(form: FormGroup): void {
    const {
      value: { keyword },
    } = form;

    this.searchCat(keyword)
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
      .subscribe(data => {
        this.searchResult.emit(data);
      });
  }

  selectText(): void {
    this.formInput.nativeElement.select();
  }
}
