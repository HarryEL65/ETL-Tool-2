import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DowntimeOverlayComponent } from './downtime-overlay.component';

describe('DowntimeOverlayComponent', () => {
  let component: DowntimeOverlayComponent;
  let fixture: ComponentFixture<DowntimeOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DowntimeOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DowntimeOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
