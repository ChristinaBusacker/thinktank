import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PipesModule } from '../../../core/pipes/pipes.module';
import { ContactService } from '../../../core/services/contact.service';
import { FrameComponent } from '../frame/frame.component';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FrameComponent,
    PipesModule,
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements OnInit {
  @Input() subject?: string;
  contactForm!: FormGroup;
  submitted = false;
  successfull = false;

  constructor(private fb: FormBuilder, private contact: ContactService) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      subject: [
        this.subject ? this.subject : '',
        [Validators.required, Validators.minLength(4)],
      ],
      message: ['', [(Validators.required, Validators.minLength(4))]],
      dsgvo: [false, [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      const response = await this.contact.send(this.contactForm.value);
      this.submitted = true;
      this.successfull = response.send;
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
