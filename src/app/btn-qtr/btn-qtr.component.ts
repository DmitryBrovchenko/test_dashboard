import { Component, OnInit } from '@angular/core';
import { DataService }       from '../data.service';

@Component({
  selector: 'app-btn-qtr',
  templateUrl: './btn-qtr.component.html',
  styleUrls: ['./btn-qtr.component.scss']
})
export class BtnQtrComponent implements OnInit {
  selectedQtr: number;

  constructor(private data: DataService) {
  }

  ngOnInit(): void {
    this.data.currentQuarter.subscribe(quarter => {
      this.selectedQtr = quarter;
    });
  }

  changeQtr(event) {
    console.log(event.target.value);
    this.data.changeQuarter(event.target.value);
  }

}
