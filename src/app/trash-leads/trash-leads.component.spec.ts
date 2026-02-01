import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashLeadsComponent } from './trash-leads.component';

describe('TrashLeadsComponent', () => {
  let component: TrashLeadsComponent;
  let fixture: ComponentFixture<TrashLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrashLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
