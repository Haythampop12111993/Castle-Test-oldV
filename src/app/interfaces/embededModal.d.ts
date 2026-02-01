import { EventEmitter } from '@angular/core';
/**
 * use for components that are modals and contains modal.d.ts
 */
export interface EmbededModal{
  /**
   * must contain the logic of opening the modal
   * usually that's done by obtaining the modal through @ViewChild then calling its open method
   * also feel free to initialize the component variables here
  */
  open(...args);

  /**
    DON'T FORGET TO DECORATE IT WITH @Output()
  */
  onSubmit:EventEmitter<any>;
}
