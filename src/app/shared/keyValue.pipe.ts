import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "keyvalue" })
export class KeyValuePipe implements PipeTransform {
  transform(value: any): Object[] {
    let keyArr: any[] = Object.keys(value),
      dataArr = [];
    keyArr.map((key) => {
      dataArr.push({
        key,
        value: value[key],
      });
    });

    return dataArr;
  }
}
