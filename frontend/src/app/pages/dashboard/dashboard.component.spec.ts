import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { TranslateService } from '@ngx-translate/core';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        {
          provide: DashboardService,
          useValue: {
            stats: [],
            latestOrders: [],
            latestInvoices: [],
            latestDeliveries: [],
            loadDashboardData: jasmine.createSpy('loadDashboardData')
          }
        },
        {
          provide: TranslateService,
          useValue: {
            currentLang: 'fr'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
  });

  it('formats invoice amounts without throwing when the translate service exposes currentLang as a property', () => {
    expect(() => (fixture.componentInstance as any).formatInvoiceAmount(1250)).not.toThrow();
  });
});
