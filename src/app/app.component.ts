import { Component, OnInit } from '@angular/core';
import NRTable               from '../assets/NRTable.json';
import ARRTable              from '../assets/ARRTable.json';
import pieGeo                from '../assets/pieGeo.json';
import pieRS                 from '../assets/pieRevStr.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angilar-basics';

  sourceDataNR = NRTable['SASTableData+NR_TABLE'];
  nameNR = 'NR';

  sourceDataARR = ARRTable['SASTableData+ARR_TABLE'];
  nameARR = 'ARR';

  sourceDataPieGeo = pieGeo['SASTableData+PIE_GEO'];
  pieNameGeo = 'TOR by Subregions';
  pieClassGeo = 'pie-geo';
  categoryNameGeo = 'GEO2';

  pieNameRS = 'TOR by Revenue Streams';
  pieClassRS = 'pie-rs';
  categoryNameRS = 'revstr';
  sourceDataPieRS = pieRS['SASTableData+PIE_RS'];

  ngOnInit() {
    this.sourceDataPieRS.forEach(d => {
      d['revstr'] = (d.category === 'New Revenue') ? 'NR ' + d.subcategory : 'ARR ' + d.subcategory;
    });
  }
}
