import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiceTypePage } from './service-type.page';

describe('ServiceTypePage', () => {
  let component: ServiceTypePage;
  let fixture: ComponentFixture<ServiceTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceTypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
