import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintChequeComponent } from './print-cheque.component';

describe('PrintChequeComponent', () => {
  let component: PrintChequeComponent;
  let fixture: ComponentFixture<PrintChequeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintChequeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintChequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
