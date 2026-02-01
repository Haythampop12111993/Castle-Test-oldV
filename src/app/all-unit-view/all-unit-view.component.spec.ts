import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllUnitViewComponent } from './all-unit-view.component';

describe('AllUnitViewComponent', () => {
  let component: AllUnitViewComponent;
  let fixture: ComponentFixture<AllUnitViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllUnitViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllUnitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
