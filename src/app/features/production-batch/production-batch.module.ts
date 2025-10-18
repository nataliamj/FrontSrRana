import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { productionBatchesRoutes } from './production-batch.routes';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(productionBatchesRoutes)
  ]
})
export class ProductionBatchesModule { }