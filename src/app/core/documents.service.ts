import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

export type DocumentRow = {
  id: number;
  userId: number;
  fileName: string;
  encrypted: boolean;
  createdAt: string;
};

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<DocumentRow[]>(`${environment.apiBaseUrl}/documents`);
  }

  upload(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<void>(`${environment.apiBaseUrl}/documents`, fd);
  }

  download(docId: number) {
    return this.http.get(`${environment.apiBaseUrl}/documents/${docId}`, { responseType: 'blob' });
  }

  delete(docId: number) {
    return this.http.delete<void>(`${environment.apiBaseUrl}/documents/${docId}`);
  }

}
