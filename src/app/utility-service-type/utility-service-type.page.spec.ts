import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UtilityServiceTypePage } from './utility-service-type.page';

describe('UtilityServiceTypePage', () => {
  let component: UtilityServiceTypePage;
  let fixture: ComponentFixture<UtilityServiceTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilityServiceTypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UtilityServiceTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
