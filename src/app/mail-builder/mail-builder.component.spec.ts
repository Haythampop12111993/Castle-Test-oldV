import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailBuilderComponent } from './mail-builder.component';

describe('MailBuilderComponent', () => {
  let component: MailBuilderComponent;
  let fixture: ComponentFixture<MailBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
