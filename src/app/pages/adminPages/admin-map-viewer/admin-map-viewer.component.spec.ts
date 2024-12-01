import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMapViewerComponent } from './admin-map-viewer.component';

describe('AdminMapViewerComponent', () => {
  let component: AdminMapViewerComponent;
  let fixture: ComponentFixture<AdminMapViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMapViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMapViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
