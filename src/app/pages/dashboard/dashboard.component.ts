import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsService, DocumentRow } from '../../core/documents.service';
import { SharesService } from '../../core/shares.service';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  documents: DocumentRow[] = [];
  selectedFile?: File;
  shareUrl = '';
  error = '';
  logs: {
    ipAddress: string;
    userAgent: string;
    accessedAt: string;
  }[] = [];
  oneTime = true; // default
  sharePassword = '';
  showPassword = false;
  showLogs = false;
  successMessage = '';

  constructor(
    private docs: DocumentsService,
    private shares: SharesService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDocs();
  }

  loadDocs() {
    this.error = '';
    this.docs.list().subscribe({
      next: (d) => (this.documents = d),
      error: () => (this.error = 'Failed to load documents'),
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? undefined;
  }

  upload() {
    if (!this.selectedFile) return;

    this.error = '';
    this.successMessage = '';

    this.docs.upload(this.selectedFile).subscribe({
      next: () => {
        this.loadDocs();

        // clear file input
        this.fileInput.nativeElement.value = '';
        this.selectedFile = undefined;

        // ✅ success message
        this.successMessage = 'Document uploaded successfully';

        // auto-hide after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: () => {
        this.error = 'Upload failed. Please try again.';
      }
    });
  }


  download(doc: DocumentRow) {
    this.docs.download(doc.id).subscribe(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = doc.fileName;
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  share(id: number) {
    this.shares.create(id, 60, this.oneTime, this.sharePassword).subscribe(res => {
      this.shareUrl = res.shareUrl;
      this.shareMap[id] = res.shareUrl;
      this.shareTypeMap[id] = res.oneTime ? 'ONE_TIME' : 'MULTI';

      // clear password after share
      this.sharePassword = '';
      this.showPassword = false;
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
  copyShareUrl() {
    if (!this.shareUrl) return;
    navigator.clipboard.writeText(this.shareUrl);
  }

  clearShareUrl() {
    this.shareUrl = '';
  }
  confirmDelete(docId: number) {
    const ok = confirm('Are you sure you want to delete this document?');
    if (!ok) return;

    this.docs.delete(docId).subscribe({
      next: () => {
        // remove from UI immediately
        this.documents = this.documents.filter(d => d.id !== docId);
      },
      error: () => {
        this.error = 'Failed to delete document';
      }
    });
  }

  viewLogs(shareMapElement: string) {
    if (!this.shareUrl) {
      this.error = 'Create a share link first to view logs';
      return;
    }

    const token = this.shareUrl.split('/').pop();
    if (!token) return;

    this.shares.getLogs(token).subscribe({
      next: (data) => {
        this.logs = data;
        this.showLogs = true;
      },
      error: () => {
        this.error = 'Failed to load access logs';
      }
    });
  }

  closeLogs() {
    this.showLogs = false;
    this.logs = [];
  }
  shareMap: Record<number, string> = {};
  shareTypeMap: Record<number, 'ONE_TIME' | 'MULTI'> = {};
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

}
