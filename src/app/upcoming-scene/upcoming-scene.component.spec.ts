import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingSceneComponent } from './upcoming-scene.component';

describe('UpcomingSceneComponent', () => {
  let component: UpcomingSceneComponent;
  let fixture: ComponentFixture<UpcomingSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
