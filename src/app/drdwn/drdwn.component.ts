import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'app-drdwn',
  templateUrl: './drdwn.component.html',
  styleUrls: ['./drdwn.component.scss']
})
export class DrdwnComponent implements OnInit {
  selectedQtr: number;

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.data.currentQuarter.subscribe(quarter => {
      this.selectedQtr=quarter; 
    })
  }

  changeQtr(event) {
    console.log(event.target.value);
    this.data.changeQuarter(event.target.value);
  }

}
