import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AgGridModule} from 'ag-grid-angular';
import { AgChartsAngularModule } from 'ag-charts-angular';
import 'ag-grid-enterprise';

import { AppComponent } from './app.component';
import { BarPyrComponent } from './bar-pyr/bar-pyr.component';
import { BtnViewComponent } from './btn-view/btn-view.component';
import { DrdwnComponent } from './drdwn/drdwn.component';
import { AgPieRsComponent } from './ag-pie-rs/ag-pie-rs.component';
import { AgTableComponent } from './ag-table/ag-table.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    BarPyrComponent,
    BtnViewComponent,
    DrdwnComponent,
    AgPieRsComponent,
    AgTableComponent,
    PieChartComponent
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([]),
    AgChartsAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
