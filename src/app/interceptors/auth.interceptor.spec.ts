import {TestBed} from '@angular/core/testing';
import {HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {AuthInterceptor} from './auth.interceptor';
import {AuthService} from '../services/auth.service';
import {of} from 'rxjs';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        {provide: AuthService, useValue: authSpy}
      ]
    });

    interceptor = TestBed.inject(AuthInterceptor);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add an Authorization header if a token is available', () => {
    authServiceSpy.getToken.and.returnValue('testToken');

    const request = {
      headers: {
        set: jasmine.createSpy('set')
      }
    } as any;

    const next = {
      handle: (req: HttpRequest<any>) => {
        expect(req.headers.get('Authorization')).toBe('Bearer testToken');
        return of(new HttpResponse());
      }
    };

    interceptor.intercept(request, next as HttpHandler).subscribe();
  });

  it('should not add an Authorization header if no token is available', () => {
    authServiceSpy.getToken.and.returnValue(null);

    const request = {
      headers: {
        set: jasmine.createSpy('set')
      }
    } as any;

    const next = {
      handle: (req: HttpRequest<any>) => {
        expect(req.headers.get('Authorization')).toBeNull();
        return of(new HttpResponse());
      }
    };

    interceptor.intercept(request, next as HttpHandler).subscribe();
  });
});
