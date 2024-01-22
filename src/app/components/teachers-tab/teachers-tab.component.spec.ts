import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersTabComponent } from './teachers-tab.component';

describe('TeachersTabComponent', () => {
  let component: TeachersTabComponent;
  let fixture: ComponentFixture<TeachersTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachersTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachersTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
