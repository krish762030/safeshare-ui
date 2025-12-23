import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class SharesService {
  constructor(private http: HttpClient) {}

  create(
    documentId: number,
    expiryMinutes: number,
    oneTime: boolean,
    password?: string
  ) {
    return this.http.post<{
      shareUrl: string;
      oneTime: boolean;
    }>(`${environment.apiBaseUrl}/shares`, {
      documentId,
      expiryMinutes,
      oneTime,
      password: password || null,
    });
  }


  revoke(token: string) {
    return this.http.post<void>(`${environment.apiBaseUrl}/shares/${token}/revoke`, {});
  }

  publicDownload(token: string, password?: string) {
    const params: any = {};
    if (password) {
      params.password = password;
    }

    return this.http.post(
      `${environment.apiBaseUrl}/s/${token}`,
      null,
      {
        params,
        responseType: 'blob',
      }
    );
  }

  getLogs(token: string) {
    return this.http.get<{
      ipAddress: string;
      userAgent: string;
      accessedAt: string;
    }[]>(
      `${environment.apiBaseUrl}/shares/${token}/logs`
    );
  }
}
