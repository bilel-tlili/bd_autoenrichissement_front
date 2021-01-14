import { Component } from '@angular/core';

@Component({
  selector: 'app-error-500',
  template: `
    <error-code
      code="500"
      [title]="'Server went wrong!'"
      [message]="'Le serveur ne répond pas, réessayer ulterieurement!'"
    >
    </error-code>
  `,
})
export class Error500Component {}
