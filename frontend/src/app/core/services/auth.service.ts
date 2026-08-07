import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  
  /**
   * Valide la force du mot de passe selon les règles métier ("backend").
   * Le mot de passe doit faire exactement 12 caractères, contenir au moins une majuscule,
   * une minuscule, un chiffre et une lettre.
   */
  validatePasswordBackend(password: string): string[] {
    const errors: string[] = [];

    if (password.length !== 12) {
      errors.push('Le mot de passe doit faire exactement 12 caractères.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre majuscule.');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une lettre minuscule.');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre.');
    }

    return errors;
  }

  /**
   * Simulation d'une requête de connexion "backend"
   */
  login(email: string, password: string): Observable<AuthResponse> {
    const validationErrors = this.validatePasswordBackend(password);
    
    if (validationErrors.length > 0) {
      // Simulation d'une erreur 400 Bad Request renvoyée par le serveur
      return throwError(() => ({
        status: 400,
        statusText: 'Bad Request',
        error: {
          message: 'Erreur de validation du mot de passe (Serveur)',
          errors: validationErrors
        }
      })).pipe(delay(500));
    }

    // Simulation de succès si tout est ok
    return of({
      success: true,
      message: 'Connexion réussie !',
      token: 'mock-jwt-token-xyz',
      user: {
        name: 'Claire Martin',
        email: email
      }
    }).pipe(
      delay(500),
      tap((res) => {
        if (res.token) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
        }
      })
    );
  }

  /**
   * Simulation d'une requête d'inscription "backend"
   */
  register(name: string, email: string, password: string): Observable<AuthResponse> {
    const validationErrors = this.validatePasswordBackend(password);

    if (validationErrors.length > 0) {
      // Simulation d'une erreur 400 Bad Request renvoyée par le serveur
      return throwError(() => ({
        status: 400,
        statusText: 'Bad Request',
        error: {
          message: 'Erreur de validation du mot de passe (Serveur)',
          errors: validationErrors
        }
      })).pipe(delay(500));
    }

    // Simulation de succès d'inscription
    return of({
      success: true,
      message: 'Inscription réussie !',
      token: 'mock-jwt-token-new',
      user: {
        name: name,
        email: email
      }
    }).pipe(
      delay(500),
      tap((res) => {
        if (res.token) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
        }
      })
    );
  }

  /**
   * Vérifie si l'utilisateur est connecté (présence du token dans le localStorage)
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Déconnecte l'utilisateur en supprimant le token du localStorage
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
