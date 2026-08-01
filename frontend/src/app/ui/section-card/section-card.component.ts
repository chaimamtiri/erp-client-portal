import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-section-card',
  imports: [MatCardModule, MatIconModule, RouterLink],
  templateUrl: './section-card.component.html',
  styleUrl: './section-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionCardComponent {
  title = input.required<string>();
  subtitle = input<string>('');
  actionLabel = input<string>('');
  actionLink = input<string>('/');
}
