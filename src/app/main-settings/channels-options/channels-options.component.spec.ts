import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelsOptionsComponent } from './channels-options.component';

describe('ChannelsOptionsComponent', () => {
  let component: ChannelsOptionsComponent;
  let fixture: ComponentFixture<ChannelsOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelsOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelsOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
