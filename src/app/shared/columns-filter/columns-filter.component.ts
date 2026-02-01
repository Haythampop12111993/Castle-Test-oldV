import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "columns-filter",
  templateUrl: "./columns-filter.component.html",
  styleUrls: ["./columns-filter.component.scss"],
})
export class ColumnsFilterComponent implements OnInit, OnChanges {
  //#region Definitions
  @Input() uid: string;
  @Input() columns: any[];

  @Output() selectColumns = new EventEmitter<any>();

  columnsNames: { [key: string]: string } = {};
  filteredColumns: any = {};

  activeNumbers = 0;

  //#endregion

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns && changes.columns.currentValue) {
      this.columnsNames = this.columns.reduce((obj, col) => {
        obj[col.key] = col.name;
        return obj;
      }, {});
    }
    if (changes.uid && changes.uid.currentValue) {
      this.checkUpdates();
    }
  }

  // logic funcs
  checkUpdates() {
    let filterData = this.fetchColumns();

    // data
    const allCols = Object.keys(this.columnsNames);
    const filtered = Object.keys(filterData).reduce((obj, key) => {
      obj[key] = true;
      return obj;
    }, {});

    // changes
    let changed = false;

    allCols.map((key) => {
      if (key in filtered) {
      } else {
        filterData[key] = true;
        changed = true;
      }
      delete filtered[key];
    });

    Object.keys(filtered).map((key) => {
      delete filtered[key];
      changed = true;
    });

    this.filteredColumns = filterData;
    if (changed) {
      this.setColumns();
    }
    this.sendCols();
  }

  // ui view
  changeColumn(colName: string) {
    this.filteredColumns[colName] = !this.filteredColumns[colName];
    this.sendCols();
    this.setColumns();
  }

  getEntries(obj: { [key: string]: any }) {
    return Object.entries(obj);
  }

  // actions
  sendCols() {
    this.activeNumbers = Object.entries(this.filteredColumns).reduce(
      (count, [key, val]) => {
        if (val) {
          count++;
        }
        return count;
      },
      0
    );
    this.selectColumns.emit(this.filteredColumns);
  }

  onReset() {
    this.filteredColumns = Object.keys(this.columnsNames).reduce((obj, key) => {
      obj[key] = true;
      return obj;
    }, {});
    this.setColumns();
    this.sendCols();
  }
  // localstorage management
  fetchColumns(): any {
    const data = localStorage.getItem(`${this.uid}-selected-columns`);
    if (!data || data[0] !== "{") {
      return {};
    }
    const columns = JSON.parse(data);
    return columns instanceof Object ? columns : {};
  }

  setColumns() {
    localStorage.setItem(
      `${this.uid}-selected-columns`,
      JSON.stringify(this.filteredColumns)
    );
  }
}
