import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinesListComponent } from './fines-list.component';

describe('FinesListComponent', () => {
  let component: FinesListComponent;
  let fixture: ComponentFixture<FinesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
