import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  time: string;
  isHtml?: boolean;
}

// Calls your Flask backend, which is registered under /api/v1/chatbot (see app/__init__.py).
const CHAT_API_URL = 'http://localhost:5000/api/v1/chatbot/chat'; // adjust for prod

@Component({
  selector: 'app-chatbot',
  imports: [ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatbotComponent {
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService = inject(AuthService);

  @ViewChild('messageContainer') private messageContainer?: ElementRef;

  isOpen = signal<boolean>(false);
  isTyping = signal<boolean>(false);
  messageInput = new FormControl('');

  // Keep a running history so the model has context; system prompt lives in Flask.
  private conversationHistory: { role: 'user' | 'assistant'; content: string }[] = [];

  messages = signal<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Bonjour Claire ! Je suis votre assistant ERP. Comment puis-je vous aider aujourd\'hui ?',
      time: this.getCurrentTime()
    }
  ]);

  constructor() {
    effect(() => {
      this.messages();
      setTimeout(() => this.scrollToBottom(), 50);
    });
  }

  toggleChat(): void {
    this.isOpen.set(!this.isOpen());
  }

  selectSuggestion(suggestion: string): void {
    this.messageInput.setValue(suggestion);
    this.sendMessage();
  }

  sendMessage(): void {
    const text = this.messageInput.value?.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: text,
      time: this.getCurrentTime()
    };
    this.messages.update((list) => [...list, userMsg]);
    this.messageInput.setValue('');
    this.conversationHistory.push({ role: 'user', content: text });

    this.isTyping.set(true);
    this.fetchAiResponse();
  }

  private async fetchAiResponse(): Promise<void> {
    try {
      const token = this.authService.getToken();

      if (!token) {
        throw new Error('No auth token found — user is not logged in.');
      }

      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ history: this.conversationHistory })
      });

      if (response.status === 401) {
        throw new Error('Unauthorized — token missing or expired.');
      }

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      const replyText: string = data?.reply?.trim()
        || "Désolé, je n'ai pas pu générer de réponse pour le moment.";

      this.conversationHistory.push({ role: 'assistant', content: replyText });

      const botMsg: ChatMessage = {
        sender: 'bot',
        text: replyText,
        time: this.getCurrentTime(),
        isHtml: false
      };
      this.messages.update((list) => [...list, botMsg]);
    } catch (err) {
      const botMsg: ChatMessage = {
        sender: 'bot',
        text: "Une erreur est survenue lors de la connexion à l'assistant. Veuillez réessayer.",
        time: this.getCurrentTime()
      };
      this.messages.update((list) => [...list, botMsg]);
      console.error('Chatbot AI error:', err);
    } finally {
      this.isTyping.set(false);
    }
  }

  private getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom(): void {
    if (this.messageContainer) {
      try {
        const element = this.messageContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      } catch (err) {
        // ignore
      }
    }
  }
}
