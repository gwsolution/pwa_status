import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppliancePage } from './appliance.page';

describe('AppliancePage', () => {
  let component: AppliancePage;
  let fixture: ComponentFixture<AppliancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppliancePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppliancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
