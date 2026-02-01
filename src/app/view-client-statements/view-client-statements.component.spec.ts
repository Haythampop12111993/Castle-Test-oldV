import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClientStatementsComponent } from './view-client-statements.component';

describe('ViewClientStatementsComponent', () => {
  let component: ViewClientStatementsComponent;
  let fixture: ComponentFixture<ViewClientStatementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewClientStatementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewClientStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
