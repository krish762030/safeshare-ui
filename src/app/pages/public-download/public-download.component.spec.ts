import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicDownloadComponent } from './public-download.component';

describe('PublicDownloadComponent', () => {
  let component: PublicDownloadComponent;
  let fixture: ComponentFixture<PublicDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicDownloadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublicDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
