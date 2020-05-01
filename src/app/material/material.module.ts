import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Material from "@angular/material";
import { MAT_DATE_LOCALE } from '@angular/material';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Material.MatToolbarModule,
    Material.MatGridListModule,
    Material.MatFormFieldModule,
    Material.MatInputModule,
    Material.MatDatepickerModule,
    Material.MatNativeDateModule,
    Material.MatButtonModule,
    Material.MatDialogModule,
    Material.MatSelectModule,
     Material.MatTableModule,
    Material.MatPaginatorModule,
    Material.MatSortModule,
    // Material.MatTableDataSource,
    Material.MatCardModule,
    Material.MatNativeDateModule,
    Material.MatSortModule
      
  ],
  exports:
  [
    Material.MatToolbarModule,
    Material.MatGridListModule,
    Material.MatFormFieldModule,
    Material.MatInputModule,
    Material.MatDatepickerModule,
    Material.MatNativeDateModule,
    Material.MatButtonModule,
    Material.MatDialogModule,
    Material.MatSelectModule,
     Material.MatTableModule,
    Material.MatPaginatorModule,
    Material.MatSortModule,
    // Material.MatTableDataSource,
    Material.MatCardModule,
    Material.MatNativeDateModule,
    Material.MatSortModule
    
  ],
  providers:[{provide:MAT_DATE_LOCALE,useValue:'en-GB'}]
})
export class MaterialModule { }
