import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  inputForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.inputForm = this.fb.group({
      keyword: [''],
    });
  }

  ngOnInit(): void {
    this.inputForm.valueChanges.subscribe(value => console.log(value));
  }
}
