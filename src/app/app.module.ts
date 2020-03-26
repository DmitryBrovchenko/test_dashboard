import { BrowserModule }         from '@angular/platform-browser';
import { NgModule }              from '@angular/core';
import { AgGridModule }          from 'ag-grid-angular';
import { AgChartsAngularModule } from 'ag-charts-angular';
import 'ag-grid-enterprise';

import { AppComponent }              from './app.component';
import { BarPyrComponent }           from './bar-pyr/bar-pyr.component';
import { BtnViewComponent }          from './btn-view/btn-view.component';
import { BtnQtrComponent }           from './btn-qtr/btn-qtr.component';
import { AgPieRsComponent }          from './ag-pie-rs/ag-pie-rs.component';
import { AgTableComponent }          from './ag-table/ag-table.component';
import { PieChartComponent }         from './pie-chart/pie-chart.component';
import { TooltipComponent }          from './tooltip/tooltip.component';
import { AngularFireModule }         from '@angular/fire';
import { environment }               from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FormsModule }               from '@angular/forms';
import { AngularFireAuthModule }     from '@angular/fire/auth';
import { AuthService }               from './auth.service';

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
    AgChartsAngularModule,
    AngularFireModule.initializeApp(environment.fbConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
