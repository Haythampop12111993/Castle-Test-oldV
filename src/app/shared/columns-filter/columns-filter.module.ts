import { KeyValuePipe } from "./../keyValue.pipe";
import { ColumnsFilterComponent } from "./columns-filter.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [CommonModule],
  declarations: [KeyValuePipe, ColumnsFilterComponent],
  exports: [ColumnsFilterComponent, KeyValuePipe],
})
export class ColumnsFilterModule {}
