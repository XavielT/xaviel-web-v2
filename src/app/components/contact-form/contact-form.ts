import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  isOpen = false;

  selectedValue = '';
  selectedLabel = 'Select an option';

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(value: string, label: string) {
    this.selectedValue = value;
    this.selectedLabel = label;
    this.isOpen = false;
  }
}
