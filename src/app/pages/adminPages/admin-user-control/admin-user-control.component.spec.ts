import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserControlComponent } from './admin-user-control.component';

describe('AdminUserControlComponent', () => {
  let component: AdminUserControlComponent;
  let fixture: ComponentFixture<AdminUserControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
