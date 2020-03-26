import { Component, OnInit }   from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, tap }            from 'rxjs/operators';
import { AuthService }         from './auth.service';

interface PieRSDatum {
  category: string;
  subcategory: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  email: string;
  password: string;
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

  constructor(public db: AngularFireDatabase, public authService: AuthService) {
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
  ngOnInit(): void {
    this.logout();
  }

  login() {
    this.authService.login(this.email, this.password);
    this.email = this.password = '';
  }

  logout() {
    this.authService.logout();
  }
}
