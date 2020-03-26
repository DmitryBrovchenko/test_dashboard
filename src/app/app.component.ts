import { Component }           from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, tap }            from 'rxjs/operators';

interface PieRSDatum {
  category: string;
  subcategory: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  values;
  isLoadingPieRS = true;
  isLoadingPieGeo = true;
  isLoadingBarPyr = true;

  sourceDataBarPyr;
  sourceDataPieGeo;
  sourceDataPieRS;

  nameNR = 'NR';
  nameARR = 'ARR';
  pieNameGeo = 'TOR by Subregions';
  pieClassGeo = 'pie-geo';
  categoryNameGeo = 'GEO2';
  pieNameRS = 'TOR by Revenue Streams';
  pieClassRS = 'pie-rs';
  categoryNameRS = 'revstr';

  constructor(public db: AngularFireDatabase) {
    this.db.list('SASTableData+BARPYRAMID').valueChanges()
      .pipe(tap(() => this.isLoadingBarPyr = false))
      .subscribe(response => this.sourceDataBarPyr = response);
    this.db.list('SASTableData+PIE_RS').valueChanges()
      .pipe(
        tap(() => this.isLoadingPieRS = false),
        map(res => {
          res.forEach((d: PieRSDatum) => d['revstr'] = (d.category === 'New Revenue') ? 'NR ' + d.subcategory : 'ARR ' + d.subcategory);
          return res;
        })
      )
      .subscribe(response => this.sourceDataPieRS = response);
    this.db.list('SASTableData+PIE_GEO').valueChanges()
      .pipe(tap(() => this.isLoadingPieGeo = false))
      .subscribe(response => this.sourceDataPieGeo = response);
  }
}
