import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  time: string;
  isHtml?: boolean;
}

@Component({
  selector: 'app-chatbot',
  imports: [ReactiveFormsModule, MatIconModule, MatButtonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatbotComponent {
  private readonly router: Router = inject(Router);

  @ViewChild('messageContainer') private messageContainer?: ElementRef;

  isOpen = signal<boolean>(false);
  isTyping = signal<boolean>(false);
  messageInput = new FormControl('');
  
  messages = signal<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Bonjour Claire ! Je suis votre assistant ERP. Comment puis-je vous aider aujourd\'hui ?',
      time: this.getCurrentTime()
    }
  ]);

  constructor() {
    // Scroll to bottom when messages list updates
    effect(() => {
      this.messages();
      // Wait for DOM layout
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

    // Add user message
    const userMsg: ChatMessage = {
      sender: 'user',
      text: text,
      time: this.getCurrentTime()
    };
    this.messages.update((list) => [...list, userMsg]);
    this.messageInput.setValue('');

    // Trigger bot reply simulation
    this.isTyping.set(true);
    setTimeout(() => {
      this.isTyping.set(false);
      this.generateBotResponse(text);
    }, 850);
  }

  private generateBotResponse(userText: string): void {
    let replyText = '';
    let isHtml = false;

    const lowerText = userText.toLowerCase();

    if (lowerText.includes('commande')) {
      replyText = `Voici vos commandes récentes :
• <b>ORD-1025</b> : En cours (Livraison prévue : Demain, 10:30)
• <b>ORD-1026</b> : Confirmée (En attente d'expédition)`;
      isHtml = true;
    } else if (lowerText.includes('facture')) {
      replyText = `Votre dernière facture <b>INV-2048</b> (Montant: €2,450, Statut: Payée) est disponible au téléchargement. <a href="/documents">Télécharger INV-2048.pdf (760 KB)</a>`;
      isHtml = true;
    } else if (lowerText.includes('adresse')) {
      replyText = `Vous pouvez gérer vos adresses de livraison et de facturation directement depuis votre espace <a href="/profile?tab=addresses">Profil & Adresses</a>.`;
      isHtml = true;
    } else {
      replyText = `Je comprends votre demande concernant "${userText}". 

En tant qu'assistant prototype, mes réponses complètes seront connectées à notre IA dans la prochaine version. Pour l'instant, vous pouvez utiliser les raccourcis d'actions rapides ci-dessous !`;
    }

    const botMsg: ChatMessage = {
      sender: 'bot',
      text: replyText,
      time: this.getCurrentTime(),
      isHtml: isHtml
    };
    this.messages.update((list) => [...list, botMsg]);
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
