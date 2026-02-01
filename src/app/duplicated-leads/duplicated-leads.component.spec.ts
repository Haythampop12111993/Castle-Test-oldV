import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicatedLeadsComponent } from './duplicated-leads.component';

describe('DuplicatedLeadsComponent', () => {
  let component: DuplicatedLeadsComponent;
  let fixture: ComponentFixture<DuplicatedLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicatedLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicatedLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
