import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContractArchiveComponent } from './view-contract-archive.component';

describe('ViewContractArchiveComponent', () => {
  let component: ViewContractArchiveComponent;
  let fixture: ComponentFixture<ViewContractArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewContractArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContractArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
