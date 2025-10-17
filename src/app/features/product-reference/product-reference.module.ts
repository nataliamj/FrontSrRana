import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { productReferencesRoutes } from './product-reference.routes';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(productReferencesRoutes)
  ]
})
export class ProductReferencesModule { }