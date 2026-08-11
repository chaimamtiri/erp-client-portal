import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authTokenInterceptor } from './auth-token.interceptor';
import { HttpClient } from '@angular/common/http';
declare const describe: any;
declare const beforeEach: any;
declare const it: any;
declare const expect: any;

describe('authTokenInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideHttpClient(withInterceptors([authTokenInterceptor]))]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('adds an authorization header when a token is available', () => {
    localStorage.setItem('authToken', 'backend-token');

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer backend-token');
    req.flush({ ok: true });
    httpMock.verify();
  });
});
