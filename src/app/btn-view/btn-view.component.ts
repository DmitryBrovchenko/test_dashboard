import { Component, OnInit } from '@angular/core';
import { DataService }       from '../data.service';

@Component({
  selector: 'app-btn-view',
  templateUrl: './btn-view.component.html',
  styleUrls: ['./btn-view.component.scss']
})
export class BtnViewComponent implements OnInit {
  viewMode: string;

  constructor(private data: DataService) {
  }

  ngOnInit(): void {
    this.data.currentViewMode.subscribe(viewMode => this.viewMode = viewMode);
  }

  changeView(event) {
    console.log(event.target.value);
    this.data.changeViewMode(event.target.value);
  }

}
