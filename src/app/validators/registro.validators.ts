import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { delay, map, of } from 'rxjs';

// Validador personalizado: confirmar contraseña
export function confirmarPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) return null;

    const password = parent.get('password')?.value;
    const confirmar = control.value;

    if (!confirmar) return null;
    return confirmar === password ? null : { passwordNoCoincide: true };
  };
}

// Validador personalizado: edad mínima 18 años
export function edadMinimaValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = Number(control.value);
    if (!control.value && control.value !== 0) return null;
    return valor >= minAge ? null : { edadMinima: { min: minAge, actual: valor } };
  };
}

// Validador personalizado: solo letras y espacios (para nombre)
export function soloLetrasValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    return regex.test(control.value) ? null : { soloLetras: true };
  };
}

// Validación asíncrona: email ya registrado (simulado con timeout)
export function emailRegistradoValidator(): AsyncValidatorFn {
  const emailsRegistrados = ['test@banco.com', 'admin@verde.mx', 'usuario@ejemplo.com'];

  return (control: AbstractControl) => {
    if (!control.value) return of(null);

    return of(control.value).pipe(
      delay(1200),
      map((email: string) => {
        return emailsRegistrados.includes(email.toLowerCase())
          ? { emailRegistrado: true }
          : null;
      })
    );
  };
}