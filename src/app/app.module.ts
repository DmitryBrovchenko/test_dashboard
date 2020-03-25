import { BrowserModule }         from '@angular/platform-browser';
import { NgModule }              from '@angular/core';
import { AgGridModule }          from 'ag-grid-angular';
import { AgChartsAngularModule } from 'ag-charts-angular';
import 'ag-grid-enterprise';

import { AppComponent }      from './app.component';
import { BarPyrComponent }   from './bar-pyr/bar-pyr.component';
import { BtnViewComponent } from './btn-view/btn-view.component';
import { BtnQtrComponent }  from './btn-qtr/btn-qtr.component';
import { AgPieRsComponent } from './ag-pie-rs/ag-pie-rs.component';
import { AgTableComponent }  from './ag-table/ag-table.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { TooltipComponent } from './tooltip/tooltip.component';

@NgModule({
  declarations: [
    AppComponent,
    BarPyrComponent,
    BtnViewComponent,
    BtnQtrComponent,
    AgPieRsComponent,
    AgTableComponent,
    PieChartComponent,
    TooltipComponent
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([]),
    AgChartsAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
