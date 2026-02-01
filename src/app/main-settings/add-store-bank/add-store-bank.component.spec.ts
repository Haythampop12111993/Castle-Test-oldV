import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoreBankComponent } from './add-store-bank.component';

describe('AddStoreBankComponent', () => {
  let component: AddStoreBankComponent;
  let fixture: ComponentFixture<AddStoreBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStoreBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStoreBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
