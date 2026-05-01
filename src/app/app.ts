import { Component, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  confirmarPasswordValidator,
  edadMinimaValidator,
  soloLetrasValidator,
  emailRegistradoValidator
} from './validators/registro.validators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  registroForm!: FormGroup;
  enviando = signal(false);
  registroExitoso = signal(false);
  mostrarPassword = signal(false);
  mostrarConfirmar = signal(false);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: [
        '',
        [Validators.required, Validators.minLength(3), soloLetrasValidator()]
      ],
      email: [
        '',
        [Validators.required, Validators.email],
        [emailRegistradoValidator()]
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(8)]
      ],
      confirmarPassword: [
        '',
        [Validators.required, confirmarPasswordValidator()]
      ],
      edad: [
        '',
        [Validators.required, Validators.min(1), Validators.max(120), edadMinimaValidator(18)]
      ],
      terminos: [false, [Validators.requiredTrue]]
    });

    // Re-validar confirmarPassword cuando cambie password
    this.registroForm.get('password')?.valueChanges.subscribe(() => {
      this.registroForm.get('confirmarPassword')?.updateValueAndValidity();
    });
  }

  // Helpers para acceder a cada control fácilmente
  get nombre()           { return this.registroForm.get('nombre')!; }
  get email()            { return this.registroForm.get('email')!; }
  get password()         { return this.registroForm.get('password')!; }
  get confirmarPassword(){ return this.registroForm.get('confirmarPassword')!; }
  get edad()             { return this.registroForm.get('edad')!; }
  get terminos()         { return this.registroForm.get('terminos')!; }

  // Retorna true si el campo debe mostrar errores (tocado o sucio)
  mostrarError(control: AbstractControl): boolean {
    return (control.dirty || control.touched) && control.invalid;
  }

  // Fortaleza de contraseña (0-4)
  get fortalezaPassword(): number {
    const pw = this.password.value || '';
    let score = 0;
    if (pw.length >= 8)         score++;
    if (/[A-Z]/.test(pw))       score++;
    if (/[0-9]/.test(pw))       score++;
    if (/[^a-zA-Z0-9]/.test(pw))score++;
    return score;
  }

  get etiquetaFortaleza(): string {
    return ['', 'Débil', 'Regular', 'Buena', 'Fuerte'][this.fortalezaPassword] || '';
  }

  // Campos válidos para barra de progreso
  get camposCompletos(): number {
    const campos = ['nombre', 'email', 'password', 'confirmarPassword', 'edad', 'terminos'];
    return campos.filter(c => this.registroForm.get(c)?.valid).length;
  }

  get progresoPorcentaje(): number {
    return Math.round((this.camposCompletos / 6) * 100);
  }

  togglePassword(): void    { this.mostrarPassword.update(v => !v); }
  toggleConfirmar(): void   { this.mostrarConfirmar.update(v => !v); }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.enviando.set(true);

    // Simular envío a API con setTimeout
    setTimeout(() => {
      console.log('Datos enviados:', this.registroForm.value);
      this.enviando.set(false);
      this.registroExitoso.set(true);
    }, 1500);
  }

  resetForm(): void {
    this.registroForm.reset({ terminos: false });
    this.registroExitoso.set(false);
    this.enviando.set(false);
  }
}