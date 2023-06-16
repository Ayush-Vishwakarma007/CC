import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListVolunteerComponent } from "./list-volunteer/list-volunteer.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { DirectiveModule } from "../../../../../directive/directive.module";

@NgModule({
  declarations: [ListVolunteerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    DirectiveModule,
  ],
  exports: [ListVolunteerComponent],
})
export class ListVolunteerModule {}
