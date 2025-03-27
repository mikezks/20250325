import { NgIf } from '@angular/common';
import { Component, DestroyRef, effect, inject, Injector, input, numberAttribute } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PassengerService } from '../../logic-passenger/data-access/passenger.service';
import { validatePassengerStatus } from '../../util-validation';
import { RouterLink } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { Passenger } from '../../logic-passenger';


@Component({
  selector: 'app-passenger-edit',
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './passenger-edit.component.html'
})
export class PassengerEditComponent {
  private passengerService = inject(PassengerService);
  private destroyRef = inject(DestroyRef);

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
  passengerResource = httpResource<Passenger | undefined>(
    () => `https://demo.angulararchitects.io/api/passenger?id=${ this.id() }`
  );

  constructor() {
    effect(() => {
      const passenger = this.passengerResource.value();

      if (passenger) {
        this.editForm.patchValue(passenger);
      }
    });

    this.destroyRef.onDestroy(() => console.log('Bye, bye! :('));
  }

  protected save(): void {
    console.log(this.editForm.value);
  }
}
