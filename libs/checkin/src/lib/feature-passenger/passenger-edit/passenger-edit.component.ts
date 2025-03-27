import { NgIf } from '@angular/common';
import { Component, DestroyRef, effect, inject, Injector, input, numberAttribute, runInInjectionContext, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { validatePassengerStatus } from '../../util-validation';
import { PassengerService } from '../../logic-passenger/data-access/passenger.service';
import { initialPassenger } from '../../logic-passenger';
import { switchMap } from 'rxjs';


@Component({
  selector: 'app-passenger-edit',
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './passenger-edit.component.html'
})
export class PassengerEditComponent {
  private passengerService = inject(PassengerService);
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);

  protected editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    firstName: [''],
    name: [''],
    bonusMiles: [0],
    passengerStatus: ['', [
      validatePassengerStatus(['A', 'B', 'C'])
    ]]
  });

  id = input(0, { transform: numberAttribute });
  passenger = toSignal(
    toObservable(this.id).pipe(
      switchMap(id => this.passengerService.findById(id))
    ), { initialValue: initialPassenger }
  );

  constructor() {
    effect(() => this.editForm.patchValue(
      this.passenger()
    ));

    this.destroyRef.onDestroy(() => console.log('Bye, bye! :('));
  }

  protected save(): void {
    console.log(this.editForm.value);
    runInInjectionContext(
      this.injector,
      () => effect(() => this.editForm.patchValue(
        this.passenger()
      ))
    );

    effect(() => this.editForm.patchValue(
      this.passenger()
    ), {
      injector: this.injector
    });    
  }
}
