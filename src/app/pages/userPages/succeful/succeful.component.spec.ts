import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccefulComponent } from './succeful.component';

describe('SuccefulComponent', () => {
  let component: SuccefulComponent;
  let fixture: ComponentFixture<SuccefulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccefulComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccefulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
