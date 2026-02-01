import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { c } from '@angular/core/src/render3';

@Directive({
   selector: '[only-numbers]'
})

export class OnlyNumbersDirective {

    @Input() onlyNumbersValue: string;
    
   constructor(private element: ElementRef) { 
       console.log(`init only number directive hereeeeeeeeeeee`);
       console.log(element);    
   }

   @HostListener('keydown', ['$event']) newKey(event: KeyboardEvent) {
        console.log(event.keyCode);
        console.log(this.onlyNumbersValue);
        if (event.keyCode == 110 && this.onlyNumbersValue.includes('.')) {
            event.preventDefault();
            return;
        }
        if (
            (event.keyCode > 47 && event.keyCode < 58) ||
            event.keyCode == 110 || event.keyCode == 8
        ) {
            return;
        } else {
            console.log('prevent default');
            event.preventDefault();
        }
    }
}