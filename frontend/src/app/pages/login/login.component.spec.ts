import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('LoginComponent Redirection', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;
  let router: Router;
  let navigateSpy: any;

  beforeEach(async () => {
    mockAuthService = {
      isLoggedIn: vi.fn().mockReturnValue(false),
      login: vi.fn().mockReturnValue(of({ success: true, message: 'Success', token: 'token' })),
      register: vi.fn().mockReturnValue(of({ success: true, message: 'Success', token: 'token' }))
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate');
  });

  it('should redirect to /dashboard on init if user is already logged in', () => {
    mockAuthService.isLoggedIn.mockReturnValue(true);
    
    // Creating fixture triggers ngOnInit
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not redirect on init if user is not logged in', () => {
    mockAuthService.isLoggedIn.mockReturnValue(false);
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should redirect to /dashboard after successful login', () => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.setMode('login');
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'Password1234' // 12 characters, fits strength validator
    });

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'Password1234');
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should redirect to /dashboard after successful registration', () => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.setMode('register');
    component.loginForm.patchValue({
      name: 'John Doe',
      email: 'test@example.com',
      password: 'Password1234',
      confirmPassword: 'Password1234'
    });

    component.onSubmit();

    expect(mockAuthService.register).toHaveBeenCalledWith('John Doe', 'test@example.com', 'Password1234');
    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });
});
