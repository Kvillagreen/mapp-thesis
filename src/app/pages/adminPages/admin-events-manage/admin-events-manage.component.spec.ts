import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventsManageComponent } from './admin-events-manage.component';

describe('AdminEventsManageComponent', () => {
  let component: AdminEventsManageComponent;
  let fixture: ComponentFixture<AdminEventsManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEventsManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEventsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
