import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsturctionUpdatesComponent } from './consturction-updates.component';

describe('ConsturctionUpdatesComponent', () => {
  let component: ConsturctionUpdatesComponent;
  let fixture: ComponentFixture<ConsturctionUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsturctionUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsturctionUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
