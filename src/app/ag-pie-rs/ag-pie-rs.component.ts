import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
import pieRevStr from "../../assets/pieRevStr.json";

@Component({
  selector: 'app-ag-pie-rs',
  templateUrl: './ag-pie-rs.component.html',
  styleUrls: ['./ag-pie-rs.component.scss']
})
export class AgPieRsComponent {
  currentView: string;
  selectedQtr: number;
  private sourceData = pieRevStr["SASTableData+PIE_RS"];
  private graphData: any;
  private options: any;

  constructor(private data: DataService) {
  }

  ngOnInit(): void {
    this.data.currentViewMode.subscribe(viewMode => {
      this.currentView = viewMode;
      this.draw();
    });
    this.data.currentQuarter.subscribe(quarter=>{
      this.selectedQtr = quarter;
      this.draw();
    });
    
  }

  aggregateData(data: any, viewMode: string, quarter: number) {
    var resultData=[];
    data.forEach((d)=>{
      if (((viewMode=="quarter-view")&&(d.quarter==quarter))||((viewMode=="cumulative-view")&&(d.quarter<=quarter))) {
        var stream=(d.category=="New Revenue") ? "NR " : "ARR "; 
        var i = resultData.map(e=>e.revstr).indexOf(stream+d.subcategory);
        if (i>=0) {
          resultData[i]['last_submit']+=d.last_submit;
          resultData[i]['latest_rollup']+=d.latest_rollup;
        }
        else {
          var tmpObj = {'revstr': stream+d.subcategory, 'last_submit': d.last_submit, 'latest_rollup': d.latest_rollup};
          resultData.push(tmpObj);
        }
      }
    } );
    resultData.forEach((d)=>{
      d.revstr= (d.last_submit>d.latest_rollup) ? d.revstr + " \u21D1" : d.revstr + " \u21D3";
    })
    return resultData;
  }

  draw() {
    this.graphData = this.aggregateData(this.sourceData, this.currentView, this.selectedQtr);
    this.options = {
      data: this.graphData,
      title: {
        text: "TOR by Revenue Streams"
      },
      series: [{
          type: 'pie',
          labelKey: 'revstr',
          angleKey: 'last_submit',
          tooltipEnabled: true,
          tooltipRenderer: params =>{params.angleKey}
      }]
    }
  }

}
