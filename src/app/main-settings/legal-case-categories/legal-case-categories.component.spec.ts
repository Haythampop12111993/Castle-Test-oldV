import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalCaseCategoriesComponent } from './legal-case-categories.component';

describe('LegalCaseCategoriesComponent', () => {
  let component: LegalCaseCategoriesComponent;
  let fixture: ComponentFixture<LegalCaseCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalCaseCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalCaseCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
