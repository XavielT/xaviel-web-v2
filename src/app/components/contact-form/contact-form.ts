import { Component, ChangeDetectorRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18n } from '../../core/i18n';


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

  readonly i18n = inject(I18n);

  selectedValue = '';

  /** Label of the chosen reason, in the current language (so it follows the language switch). */
  get selectedLabel(): string {
    switch (this.selectedValue) {
      case 'job': return this.i18n.t('form.optJob');
      case 'project': return this.i18n.t('form.optProject');
      case 'other': return this.i18n.t('form.optOther');
      default: return this.i18n.t('form.select');
    }
  }



  /* Live feedback */
  readonly emailAddress = 'xavieljoseterrerocuevas9@gmail.com';
  readonly messageMax = 1000;
  readonly messageMin = 10;
  messageLength = 0;
  topicTouched = false;
  emailCopied = false;
  private copyTimer?: ReturnType<typeof setTimeout>;

  onMessageInput(value: string) {
    this.messageLength = (value ?? '').length;
  }

  async copyEmail() {
    try {
      await navigator.clipboard.writeText(this.emailAddress);
      this.emailCopied = true;
    } catch {
      // Clipboard can be blocked (insecure context, permissions); fall back to a selectable prompt.
      window.prompt(this.i18n.t('form.copyPrompt'), this.emailAddress);
      return;
    }
    clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => {
      this.emailCopied = false;
      this.cd.detectChanges();
    }, 2000);
  }

  /* Button */
  isLoading = false;
  messageStatus: 'success' | 'error' | 'rateLimit' | null = null;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) this.topicTouched = true;
  }

  selectOption(value: string) {
    this.selectedValue = value;
    this.isOpen = false;
    this.topicTouched = true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /* To manage the submmit */
  async onSubmit(event: Event, contactForm: any) {

    event.preventDefault();

    const formElement = event.currentTarget as HTMLFormElement;
    this.topicTouched = true;

    const formData = new FormData(formElement);
    const data: any = Object.fromEntries(formData.entries());

    /* VALIDATION */

    // The per-field messages are already on screen; here we just take the user to the first problem.
    const problem =
      !data['name'] || data['name'].toString().trim().length < 2 ? 'name'
      : !data['email'] || !this.isValidEmail(data['email']) ? 'email'
      : !this.selectedValue ? 'topic'
      : !data['message'] || data['message'].toString().trim().length < this.messageMin ? 'message'
      : null;

    if (problem) {
      const target = problem === 'topic'
        ? formElement.querySelector<HTMLElement>('.select-trigger')
        : formElement.querySelector<HTMLElement>('#' + problem);
      target?.focus();
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
        this.selectedValue = '';
        this.topicTouched = false;
        this.messageLength = 0;

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
      }, 6000);

    }
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
    this.selectedValue = '';
    this.messageStatus = null;
    this.topicTouched = false;
    this.messageLength = 0;
  }

}
