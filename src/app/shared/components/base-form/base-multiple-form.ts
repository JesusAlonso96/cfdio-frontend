import { FormGroup, AbstractControl, Validators } from '@angular/forms';

export abstract class BaseMultipleFormComponent<
    TForms extends Record<string, any> = Record<string, any>
> {
    /**
     * Si el componente solo usa un formulario principal,
     * puede seguir definiéndolo aquí:
     *   form = new FormGroup({...});
     */
    abstract forms: { [K in keyof TForms]: FormGroup };

    /**
     * Accede al FormGroup especificado.
     */
    getForm<K extends keyof TForms>(formName: K): FormGroup {
        return this.forms[formName];
    }

    /**
     * Accede al control de un campo dentro de un formulario.
     */
    control<
        F extends keyof TForms,
        K extends string
    >(formName: F, controlName: K): AbstractControl | null {
        return this.getForm(formName).get(controlName as string);
    }

    value<
        F extends keyof TForms,
        K extends string
    >(formName: F, controlName: K): any {
        return this.control(formName, controlName)?.value ?? null;
    }

    hasError<F extends keyof TForms, K extends string>(formName: F, controlName: K, error: string): boolean {
        const ctrl = this.control(formName, controlName);
        return !!ctrl && ctrl.hasError(error) && ctrl.touched;
    }

    markAllTouched(formName?: keyof TForms): void {
        if (formName) {
            this.getForm(formName).markAllAsTouched();
        } else {
            // Marca todos los forms
            Object.values(this.forms).forEach(f => f.markAllAsTouched());
        }
    }

    setEnable<
        F extends keyof TForms,
        K extends string
    >(formName: F, controlName: K): void {
        this.control(formName, controlName)?.enable({ onlySelf: true });
    }

    setDisable<
        F extends keyof TForms,
        K extends string
    >(formName: F, controlName: K): void {
        this.control(formName, controlName)?.disable({ onlySelf: true });
    }

    setRequired<F extends keyof TForms, K extends string>(formName: F, controlName: K): void {
        const ctrl = this.control(formName, controlName);
        ctrl?.addValidators(Validators.required);
        ctrl?.updateValueAndValidity();
    }

    removeRequired<
        F extends keyof TForms,
        K extends string
    >(formName: F, controlName: K): void {
        const ctrl = this.control(formName, controlName);
        ctrl?.removeValidators(Validators.required);
        ctrl?.updateValueAndValidity();
    }

    setPatternValidator<
        F extends keyof TForms,
        K extends string
    >(formName: F, controlName: K, regex: string | RegExp): void {
        const ctrl = this.control(formName, controlName);
        ctrl?.addValidators(Validators.pattern(regex));
        ctrl?.updateValueAndValidity();
    }

    removePatternValidator<
        F extends keyof TForms,
        K extends string
    >(formName: F, controlName: K, regex: string | RegExp): void {
        const ctrl = this.control(formName, controlName);
        ctrl?.removeValidators(Validators.pattern(regex));
        ctrl?.updateValueAndValidity();
    }
}
