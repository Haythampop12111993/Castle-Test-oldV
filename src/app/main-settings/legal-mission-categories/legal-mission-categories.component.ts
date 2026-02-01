import { Component, OnInit } from "@angular/core";
import { ErrorHandlerService } from "../../services/shared/error-handler.service";
import swal from "sweetalert2";
import { LegalMissionsService } from "../../legal-affairs/services/legal-missions.service";

@Component({
  selector: "app-legal-mission-categories",
  templateUrl: "./legal-mission-categories.component.html",
  styleUrls: ["./legal-mission-categories.component.css"],
})
export class LegalMissionCategoriesComponent implements OnInit {
  add_category: any;

  categories: any[];

  current_selected_category: any;

  constructor(
    private legalMissionsService: LegalMissionsService,
    private errorHandlerService: ErrorHandlerService
  ) {}
  ngOnInit() {
    this.getAllCategories();
  }

  addCategory() {
    const categoryData = {
      name: this.add_category,
    };
    this.legalMissionsService.postMissionCategory(categoryData).subscribe(
      (data: any) => {
        this.getAllCategories();
        this.add_category = "";
        swal("Category added successfully", "", "success");
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  deleteCategory(id) {
    this.legalMissionsService.deleteMissionCategory(id).subscribe(
      (data: any) => {
        swal("Category deleted successfully", "", "success");
        this.getAllCategories();
      },
      (err) => this.errorHandlerService.handleErorr(err)
    );
  }

  getAllCategories(page?) {
    this.legalMissionsService.getMissionCategories(page).subscribe(
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
    this.legalMissionsService
      .updateMissionCategory(this.current_selected_category.id, categoryData)
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
