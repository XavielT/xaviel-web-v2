import { Component, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})

export class ContactForm {

  constructor(private cd: ChangeDetectorRef) { }

  /* To manage the select option */
  isOpen = false;

  selectedValue = '';
  selectedLabel = 'Select an option';



  /* Button */
  isLoading = false;
  messageStatus: 'success' | 'error' | 'rateLimit' | null = null;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(value: string, label: string) {
    this.selectedValue = value;
    this.selectedLabel = label;
    this.isOpen = false;
  }

  /* To manage the submmit */
  async onSubmit(event: Event, contactForm: any) {

    event.preventDefault();

    const formElement = event.currentTarget as HTMLFormElement;

    if (contactForm.invalid) {
      return;
    }

    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData.entries());

    /* VALIDATION */

    if (!data['name'] || data['name'].toString().trim().length < 2) {
      this.messageStatus = 'error';
      return;
    }

    if (!data['email']) {
      this.messageStatus = 'error';
      return;
    }

    if (!this.selectedValue) {
      this.messageStatus = 'error';
      return;
    }

    if (!data['message'] || data['message'].toString().trim().length < 10) {
      this.messageStatus = 'error';
      return;
    }

    this.isLoading = true;
    this.messageStatus = null;

    try {

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {

        this.messageStatus = 'success';

        contactForm.resetForm();
        this.selectedLabel = 'Select an option';
        this.selectedValue = '';

      } else if (response.status === 429) {

        this.messageStatus = 'rateLimit';

      } else {

        this.messageStatus = 'error';

      }

    } catch {

      this.messageStatus = 'error';

    }

    setTimeout(() => {
      this.messageStatus = null;
      this.cd.detectChanges();
    }, 3000);

    this.isLoading = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {

    const target = event.target as HTMLElement;

    if (!target.closest('.custom-select')) {
      this.isOpen = false;
    }

  }

  clearForm(form: any) {
    form.reset();
    this.selectedLabel = 'Select an option';
    this.selectedValue = '';
    this.messageStatus = null;
  }

}
