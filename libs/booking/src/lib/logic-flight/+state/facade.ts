import { inject } from "@angular/core";
import { FlightFilter } from "../model/flight-filter";
import { BookingStore } from "./signal-store/booking.store";
import { Flight } from "../model/flight";


export function injectTicketsFacade() {
  const store = inject(BookingStore);

  return {
    filter: store.filter,
    basket: store.basket,
    flights: store.flights,
    search: (filter: FlightFilter) => {
      store.setFilter(filter);
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    update: (flight: Flight) => {},
    reset: () => store.setFlights([])
  };
}
