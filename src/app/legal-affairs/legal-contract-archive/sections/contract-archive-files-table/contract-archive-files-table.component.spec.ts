import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractArchiveFilesTableComponent } from './contract-archive-files-table.component';

describe('ContractArchiveFilesTableComponent', () => {
  let component: ContractArchiveFilesTableComponent;
  let fixture: ComponentFixture<ContractArchiveFilesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractArchiveFilesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractArchiveFilesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
