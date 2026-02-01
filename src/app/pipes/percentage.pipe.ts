import { Pipe } from '@angular/core';

@Pipe({name: 'percentage'})
export class PercentagePipe {
    // transform(value: number) {
    //     if (value == null) {
    //         return;
    //     } else if (value != null) {
    //         return this.currencyPipe.transform(value, currency, symbol);
    //     }
    //     return `${value}%`
    // }
  }
  