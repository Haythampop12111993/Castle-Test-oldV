import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalMissionSidesComponent } from './legal-mission-sides.component';

describe('LegalMissionSidesComponent', () => {
  let component: LegalMissionSidesComponent;
  let fixture: ComponentFixture<LegalMissionSidesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalMissionSidesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalMissionSidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
