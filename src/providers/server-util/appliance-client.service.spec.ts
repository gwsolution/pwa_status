import { TestBed } from '@angular/core/testing';

import { ApplianceClientService } from './appliance-client.service';

describe('ApplianceClientService', () => {
  let service: ApplianceClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplianceClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
