import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalMissionCategoriesComponent } from './legal-mission-categories.component';

describe('LegalMissionCategoriesComponent', () => {
  let component: LegalMissionCategoriesComponent;
  let fixture: ComponentFixture<LegalMissionCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalMissionCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalMissionCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
