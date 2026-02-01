import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CfoPinComponent } from './cfo-pin.component';

describe('CfoPinComponent', () => {
  let component: CfoPinComponent;
  let fixture: ComponentFixture<CfoPinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CfoPinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CfoPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
