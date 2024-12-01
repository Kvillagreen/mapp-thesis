import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventsCreateComponent } from './admin-events-create.component';

describe('AdminEventsCreateComponent', () => {
  let component: AdminEventsCreateComponent;
  let fixture: ComponentFixture<AdminEventsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEventsCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEventsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
