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

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /* To manage the submmit */
  async onSubmit(event: Event, contactForm: any) {

    event.preventDefault();

    const formElement = event.currentTarget as HTMLFormElement;

    const formData = new FormData(formElement);
    const data: any = Object.fromEntries(formData.entries());

    /* VALIDATION */

    if (!data['name'] || data['name'].toString().trim().length < 2) {
      this.showErrorMessage();
      return;
    }

    if (!data['email'] || !this.isValidEmail(data['email'])) {
      this.showErrorMessage();
      return;
    }

    if (!this.selectedValue) {
      this.showErrorMessage();
      return;
    }

    if (!data['message'] || data['message'].toString().trim().length < 10) {
      this.showErrorMessage();
      return;
    }

    this.isLoading = true;
    this.cd.detectChanges();

    try {

      const payload = {
        ...data,
        topic: this.selectedValue
      };
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {

        this.messageStatus = 'success';
        this.cd.detectChanges();

        contactForm.resetForm();
        this.selectedLabel = 'Select an option';
        this.selectedValue = '';

      } else if (response.status === 429) {

        this.messageStatus = 'rateLimit';
        this.cd.detectChanges();

      } else {

        this.messageStatus = 'error';
        this.cd.detectChanges();

      }

    } catch (error) {

      console.error('Contact form error:', error);
      this.messageStatus = 'error';
      this.cd.detectChanges();

    } finally {

      this.isLoading = false;
      this.cd.detectChanges();

      setTimeout(() => {
        this.messageStatus = null;
        this.cd.detectChanges();
      }, 3000);

    }
  }

  private showErrorMessage() {
    this.messageStatus = 'error';
    this.cd.detectChanges();
    setTimeout(() => {
      this.messageStatus = null;
      this.cd.detectChanges();
    }, 3000);
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
