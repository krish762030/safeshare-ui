import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharesService } from '../../core/shares.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-download',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public-download.component.html',
})
export class PublicDownloadComponent {

  token = '';
  password = '';
  error = '';
  loading = false;
  done = false;

  constructor(
    private route: ActivatedRoute,
    private shares: SharesService
  ) {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  download() {
    this.error = '';
    this.loading = true;

    this.shares.publicDownload(this.token, this.password).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = '';
        a.click();
        URL.revokeObjectURL(a.href);
        this.loading = false;
        this.done = true;
      },
      error: (e) => {
        this.loading = false;
        this.error =
          e?.error?.message ||
          'Invalid password or link expired';
      },
    });
  }
}
