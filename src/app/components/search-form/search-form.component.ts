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
import { of, Subject } from 'rxjs';
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
  @Output() selectedCatName = new EventEmitter<string>();

  @ViewChild('formInput', { static: true })
  formInput: ElementRef<HTMLInputElement>;

  altImage = 'https://t1.daumcdn.net/cfile/tistory/998FBA335C764C711D';

  hasNoKeyword = false;

  inputFormGroup: FormGroup;

  cats$ = of<CatInfo[]>([]);

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
      takeUntil(this.onDestroy)
    );

    this.formInput = formInput;

    this.cats$
      .pipe(
        map(
          cats =>
            (this.hasNoKeyword =
              cats.length === 0 &&
              this.inputFormGroup.controls['keyword'].value.length !== 0)
        ),
        takeUntil(this.onDestroy)
      )
      .subscribe(result => (this.hasNoKeyword = result));
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
  }

  selectCat(keyword: string): void {
    this.selectedCatName.emit(keyword);
  }

  selectText(): void {
    this.formInput.nativeElement.select();
  }
}
