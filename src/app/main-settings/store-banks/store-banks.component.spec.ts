import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreBanksComponent } from './store-banks.component';

describe('StoreBanksComponent', () => {
  let component: StoreBanksComponent;
  let fixture: ComponentFixture<StoreBanksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreBanksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
