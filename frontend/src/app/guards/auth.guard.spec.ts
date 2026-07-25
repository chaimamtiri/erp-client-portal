import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard, noAuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Auth Guards', () => {
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockAuthService = {
      isLoggedIn: vi.fn().mockReturnValue(false)
    };

    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true)
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  describe('authGuard', () => {
    it('should allow access if user is logged in', () => {
      mockAuthService.isLoggedIn.mockReturnValue(true);

      const result = TestBed.runInInjectionContext(() => 
        authGuard(null as any, null as any)
      );

      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should block access and redirect to / if user is not logged in', () => {
      mockAuthService.isLoggedIn.mockReturnValue(false);

      const result = TestBed.runInInjectionContext(() => 
        authGuard(null as any, null as any)
      );

      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('noAuthGuard', () => {
    it('should allow access if user is not logged in', () => {
      mockAuthService.isLoggedIn.mockReturnValue(false);

      const result = TestBed.runInInjectionContext(() => 
        noAuthGuard(null as any, null as any)
      );

      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should block access and redirect to /dashboard if user is logged in', () => {
      mockAuthService.isLoggedIn.mockReturnValue(true);

      const result = TestBed.runInInjectionContext(() => 
        noAuthGuard(null as any, null as any)
      );

      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });
});
