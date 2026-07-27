import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  time: string;
  isHtml?: boolean;
}

@Component({
  selector: 'app-chatbot',
  imports: [ReactiveFormsModule, MatIconModule, MatButtonModule, HttpClientModule],
  template: `
    <div class="chatbot-container">
      <button class="chat-fab" (click)="toggleChat()" aria-label="Ouvrir l'assistant de chat">
        <mat-icon>smart_toy</mat-icon>
        <span class="chat-badge"></span>
      </button>

      @if (isOpen()) {
        <div class="chat-window">
          <div class="chat-header">
            <div class="chat-header__info">
              <div class="chat-avatar">
                <mat-icon>smart_toy</mat-icon>
              </div>
              <div>
                <h3>Assistant Client</h3>
                <span class="status-indicator">
                  <span class="status-dot"></span>
                  En ligne
                </span>
              </div>
            </div>
            <button mat-icon-button (click)="toggleChat()" aria-label="Fermer le chat">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="chat-messages" #messageContainer>
            @for (msg of messages(); track msg.time + msg.text) {
              <div class="message-wrapper" [class.user]="msg.sender === 'user'">
                <div class="message-bubble" [class.user]="msg.sender === 'user'">
                  @if (msg.isHtml) {
                    <div [innerHTML]="msg.text"></div>
                  } @else {
                    <p>{{ msg.text }}</p>
                  }
                </div>
                <span class="message-time">{{ msg.time }}</span>
              </div>
            }

            @if (isTyping()) {
              <div class="message-wrapper">
                <div class="message-bubble typing-bubble">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </div>
              </div>
            }
          </div>

          <div class="chat-suggestions">
            <button class="suggestion-chip" (click)="selectSuggestion('📦 Suivre mes commandes')">
              📦 Suivre mes commandes
            </button>
            <button class="suggestion-chip" (click)="selectSuggestion('📄 Télécharger ma dernière facture')">
              📄 Télécharger facture
            </button>
            <button class="suggestion-chip" (click)="selectSuggestion('🏠 Modifier mes adresses')">
              🏠 Modifier mes adresses
            </button>
          </div>

          <form class="chat-input-form" (submit)="sendMessage(); $event.preventDefault()">
            <input
              type="text"
              [formControl]="messageInput"
              placeholder="Écrivez votre message..."
              aria-label="Message à envoyer"
            />
            <button type="submit" mat-icon-button color="primary" [disabled]="!messageInput.value?.trim()" aria-label="Envoyer">
              <mat-icon>send</mat-icon>
            </button>
          </form>
        </div>
      }
    </div>
  `,
  styles: [
    `:host { display: block; }`,
    `.chatbot-container { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999; font-family: inherit; }`,
    `.chat-fab { width: 56px; height: 56px; border-radius: 50%; border: none; background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; display: grid; place-items: center; cursor: pointer; box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4); position: relative; transition: transform 0.2s ease, background 0.2s ease; }`,
    `.chat-fab:hover { transform: scale(1.08); background: linear-gradient(135deg, #1d4ed8, #4338ca); }`,
    `.chat-badge { width: 12px; height: 12px; border-radius: 50%; background: #f59e0b; border: 2px solid white; position: absolute; top: 0; right: 0; animation: pulse 2s infinite; }`,
    `.chat-window { position: absolute; bottom: 70px; right: 0; width: 360px; height: 500px; border-radius: 20px; background: white; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); display: flex; flex-direction: column; overflow: hidden; border: 1px solid rgba(226, 232, 240, 0.8); animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }`,
    `@keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }`,
    `@keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); } }`,
    `.chat-header { background: linear-gradient(135deg, #1e293b, #0f172a); color: white; padding: 0.9rem 1.2rem; display: flex; justify-content: space-between; align-items: center; }`,
    `.chat-header h3 { margin: 0; font-size: 1rem; font-weight: 600; }`,
    `.chat-header__info { display: flex; align-items: center; gap: 0.75rem; }`,
    `.chat-avatar { width: 34px; height: 34px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); display: grid; place-items: center; }`,
    `.chat-avatar mat-icon { font-size: 20px; width: 20px; height: 20px; }`,
    `.status-indicator { font-size: 0.75rem; color: #10b981; display: inline-flex; align-items: center; gap: 0.3rem; margin-top: 0.1rem; }`,
    `.status-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; display: inline-block; animation: pulseDot 1.5s infinite; }`,
    `@keyframes pulseDot { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`,
    `.chat-header button { color: white; }`,
    `.chat-messages { flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.8rem; background: #f8fafc; }`,
    `.message-wrapper { display: flex; flex-direction: column; max-width: 80%; }`,
    `.message-wrapper.user { align-self: flex-end; max-width: 80%; }`,
    `.message-bubble { padding: 0.75rem 1rem; border-radius: 16px 16px 16px 4px; background: white; color: #1e293b; font-size: 0.9rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02); border: 1px solid #f1f5f9; }`,
    `.message-bubble.user { background: #2563eb; color: white; border-radius: 16px 16px 4px 16px; border: none; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25); }`,
    `.message-bubble p { margin: 0; white-space: pre-wrap; line-height: 1.4; }`,
    `.message-bubble a { color: #2563eb; font-weight: 600; text-decoration: underline; }`,
    `.message-bubble.user a { color: white; }`,
    `.message-time { font-size: 0.72rem; color: #94a3b8; margin-top: 0.25rem; padding: 0 0.2rem; }`,
    `.message-wrapper.user .message-time { align-self: flex-end; }`,
    `.typing-bubble { display: flex; align-items: center; gap: 0.25rem; padding: 0.75rem 1.1rem; }`,
    `.typing-bubble .dot { width: 6px; height: 6px; border-radius: 50%; background: #94a3b8; animation: bounce 1.4s infinite ease-in-out both; }`,
    `.typing-bubble .dot:nth-child(1) { animation-delay: -0.32s; }`,
    `.typing-bubble .dot:nth-child(2) { animation-delay: -0.16s; }`,
    `@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }`,
    `.chat-suggestions { display: flex; gap: 0.4rem; padding: 0.6rem 0.8rem; overflow-x: auto; background: white; border-top: 1px solid #f1f5f9; white-space: nowrap; -ms-overflow-style: none; scrollbar-width: none; }`,
    `.chat-suggestions::-webkit-scrollbar { display: none; }`,
    `.suggestion-chip { border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 999px; padding: 0.4rem 0.8rem; font-size: 0.78rem; font-weight: 500; color: #475569; cursor: pointer; transition: all 0.2s ease; flex-shrink: 0; }`,
    `.suggestion-chip:hover { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; }`,
    `.chat-input-form { display: flex; padding: 0.6rem 0.8rem; background: white; border-top: 1px solid #f1f5f9; align-items: center; gap: 0.5rem; }`,
    `.chat-input-form input { flex: 1; border: 1px solid #e2e8f0; padding: 0.6rem 1rem; border-radius: 999px; outline: none; font-size: 0.88rem; transition: border-color 0.2s ease; background: #f8fafc; }`,
    `.chat-input-form input:focus { border-color: #2563eb; background: white; }`,
    `.chat-input-form button { flex-shrink: 0; }`,
    `.dark-theme .chat-window { background: #1e293b; border-color: #334155; }`,
    `.dark-theme .chat-header { background: linear-gradient(135deg, #0f172a, #020617); }`,
    `.dark-theme .chat-messages { background: #0f172a; }`,
    `.dark-theme .message-bubble { background: #1e293b; color: #f8fafc; border-color: #334155; }`,
    `.dark-theme .message-bubble.user { background: #2563eb; color: white; border: none; }`,
    `.dark-theme .chat-suggestions { background: #1e293b; border-top-color: #334155; }`,
    `.dark-theme .suggestion-chip { background: #0f172a; border-color: #334155; color: #94a3b8; }`,
    `.dark-theme .suggestion-chip:hover { background: rgba(37,99,235,0.15); border-color: #2563eb; color: #3b82f6; }`,
    `.dark-theme .chat-input-form { background: #1e293b; border-top-color: #334155; }`,
    `.dark-theme .chat-input-form input { background: #0f172a; border-color: #334155; color: #f8fafc; }`,
    `.dark-theme .chat-input-form input:focus { border-color: #2563eb; background: #1e293b; }`,
    `.dark-theme .message-bubble a { color: #60a5fa; }`,
    `.dark-theme .message-bubble.user a { color: white; }`
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatbotComponent {
  private readonly http: HttpClient = inject(HttpClient);

  @ViewChild('messageContainer') private messageContainer?: ElementRef;

  isOpen = signal<boolean>(false);
  isTyping = signal<boolean>(false);
  messageInput = new FormControl('');

private readonly GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
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

    this.isTyping.set(true);
    this.fetchLLMResponse(text);
  }

  private fetchLLMResponse(userText: string): void {
    const url = `${this.GEMINI_URL}?key=${environment.geminiApiKey}`;

    const body = {
      contents: [{
        parts: [{
          text: `You are "Assistant Client", a helpful ERP customer support bot.
You help users track orders, download invoices, and manage addresses.
Be concise, friendly, and professional.
Respond in the same language the user writes in (French or English).
User message: ${userText}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 350,
        topP: 0.95
      }
    };

    this.http.post<any>(url, body).subscribe({
      next: (res) => {
        this.isTyping.set(false);
        const reply = res.candidates?.[0]?.content?.parts?.[0]?.text || "Désolé, je n'ai pas compris.";

        const botMsg: ChatMessage = {
          sender: 'bot',
          text: reply.trim(),
          time: this.getCurrentTime(),
          isHtml: false
        };
        this.messages.update((list) => [...list, botMsg]);
      },
      error: (err) => {
        this.isTyping.set(false);
        console.error('Gemini API error:', err);

        const botMsg: ChatMessage = {
          sender: 'bot',
          text: "Oups ! Mon cerveau numérique fait une sieste. Réessayez dans quelques secondes !",
          time: this.getCurrentTime()
        };
        this.messages.update((list) => [...list, botMsg]);
      }
    });
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
