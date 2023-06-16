import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {VendorBookingComponent} from "./vendor-booking.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    FormsModule

  ],
  declarations: [VendorBookingComponent],
  exports: [VendorBookingComponent]
})
export class VendorBookingModule {
}
