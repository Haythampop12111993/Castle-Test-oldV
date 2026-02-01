import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ColumnsFilterComponent } from "./columns-filter.component";

describe("ColumnsFilterComponent", () => {
  let component: ColumnsFilterComponent;
  let fixture: ComponentFixture<ColumnsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColumnsFilterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
