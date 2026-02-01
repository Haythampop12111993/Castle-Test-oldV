import { Component, OnInit } from "@angular/core";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import swal from "sweetalert2";
import { LegalCasesService } from "../../legal-affairs/services/legal-cases.service";

@Component({
  selector: "app-legal-case-categories",
  templateUrl: "./legal-case-categories.component.html",
  styleUrls: ["./legal-case-categories.component.css"],
})
export class LegalCaseCategoriesComponent implements OnInit {
  add_category: any;

  categories: any[];

  current_selected_category: any;

  constructor(
    private legalCasesService: LegalCasesService,
    private errorHandlerService: ErrorHandlerService
  ) {}
  ngOnInit() {
    this.getAllCategories();
  }

  addCategory() {
    const categoryData = {
      name: this.add_category,
    };
    this.legalCasesService.postCaseCategory(categoryData).subscribe(
      (data: any) => {
        this.getAllCategories();
        this.add_category = "";
        swal("Category added successfully", "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  deleteCategory(id) {
    this.legalCasesService.deleteCaseCategory(id).subscribe(
      (data: any) => {
        swal("Category deleted successfully", "", "success");
        this.getAllCategories();
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  getAllCategories(page?) {
    this.legalCasesService.getCaseCategories(page).subscribe(
      (data: any) => {
        this.categories = data;
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  editCategory(category) {
    this.current_selected_category = category;
    this.add_category = this.current_selected_category.name;
  }

  updateCategory() {
    const categoryData = {
      name: this.add_category,
    };
    this.legalCasesService
      .updateCaseCategory(this.current_selected_category.id, categoryData)
      .subscribe(
        (res: any) => {
          this.current_selected_category = undefined;
          this.add_category = "";
          this.getAllCategories();

          swal("Success", "Edited Category successfully", "success");
        },
        (err) => {
          console.log(err);
        }
      );
  }

  cancelUpdate() {
    this.current_selected_category = undefined;
  }
}
