import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsTabComponent } from './admins-tab.component';

describe('AdminsTabComponent', () => {
  let component: AdminsTabComponent;
  let fixture: ComponentFixture<AdminsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
