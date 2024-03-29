import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationSelectComponent } from './location-select.component';

describe('LocationSelectComponent', () => {
  let component: LocationSelectComponent;
  let fixture: ComponentFixture<LocationSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationSelectComponent]
    });
    fixture = TestBed.createComponent(LocationSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
