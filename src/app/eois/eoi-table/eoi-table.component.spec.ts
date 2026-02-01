import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EoiTableComponent } from './eoi-table.component';

describe('EoiTableComponent', () => {
  let component: EoiTableComponent;
  let fixture: ComponentFixture<EoiTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EoiTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EoiTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
