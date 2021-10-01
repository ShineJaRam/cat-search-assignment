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
import { Observable, Subject } from 'rxjs';
import { CatInfo } from '../../models';
import { CatsService } from '../../service/cats.service';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
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
  @Output() selectedCatName = new EventEmitter<string>();

  @ViewChild('formInput', { static: true })
  formInput: ElementRef<HTMLInputElement>;

  altImage = 'https://t1.daumcdn.net/cfile/tistory/998FBA335C764C711D';

  hasNoKeyword = false;
  focusOut = false;

  inputFormGroup: FormGroup;

  cats$: Observable<CatInfo[]>;

  onDestroy = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private catService: CatsService,
    formInput: ElementRef<HTMLInputElement>
  ) {
    this.inputFormGroup = this.formBuilder.group({
      keyword: [''],
    });

    this.cats$ = this.inputFormGroup.controls['keyword'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((keyword: string) => this.catService.searchCats(keyword)),
      shareReplay(1),
      takeUntil(this.onDestroy)
    );

    this.cats$
      .pipe(
        map(
          cats =>
            cats.length === 0 &&
            this.inputFormGroup.controls['keyword'].value.length !== 0
        )
      )
      .subscribe(result => (this.hasNoKeyword = result));

    this.formInput = formInput;
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  onSubmit(): void {
    const {
      value: { keyword },
    } = this.inputFormGroup;

    this.selectedCatName.emit(keyword);
    this.focusOut = false;
  }

  selectCat(keyword: string): void {
    this.inputFormGroup.patchValue({
      keyword,
    });
    this.focusOut = false;
    this.selectedCatName.emit(keyword);
  }

  selectText(): void {
    this.focusOut = true;
    this.formInput.nativeElement.select();
  }
}
