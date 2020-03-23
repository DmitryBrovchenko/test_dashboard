import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ag-table',
  templateUrl: './ag-table.component.html',
  styleUrls: ['./ag-table.component.scss']
})
export class AgTableComponent implements OnInit {

  @Input() name: string;
  @Input() sourceData: any;

  columnDefs;
  rowData;

  defaultColDef = {resizable: true};

  columnTypes = {
    numeric: {
      valueFormatter: params => {
        return (params.value != null) ? params.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : params.value;
      }
    },
    percent: {
      valueFormatter: params => {
        return (params.value != null) ? (params.value * 100).toFixed(2) + '%' : null;
      }
    }
  };

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  ngOnInit() {
    this.rowData = this.sourceData;
    this.columnDefs = [
      {headerName: this.name, field: 'refresh_date', pinned: 'left', aggFunc: minDate},
      {
        headerName: 'Performance to Date',
        showRowGroup: 'perf_to_date',
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
          suppressCount: true
        }
      },
      {headerName: 'Performance to Date', field: 'perf_to_date', rowGroup: true, hide: true},
      {headerName: 'Sub Region', field: 'GEO2'},
      {headerName: 'Target', field: 'Target', type: 'numeric', colId: 'T', aggFunc: 'sum'},
      {headerName: 'Q1', field: 'LF_Q1', type: 'numeric', aggFunc: 'sum'},
      {headerName: 'Q2', field: 'LF_Q2', type: 'numeric', aggFunc: 'sum'},
      {headerName: 'Q3', field: 'LF_Q3', type: 'numeric', aggFunc: 'sum'},
      {headerName: 'Q4', field: 'LF_Q4', type: 'numeric', aggFunc: 'sum'},
      {headerName: 'Full Year', field: 'LF_FY', type: 'numeric', colId: 'FY', aggFunc: 'sum'},
      {headerName: 'LY Actuals', field: 'LY_actuals', colId: 'LY', aggFunc: 'sum', hide: true},
      {
        headerName: '% of Target', type: 'percent',
        valueGetter: params => {
          return (params.getValue('T') > 0) ? params.getValue('FY') / params.getValue('T') : null;
        }
      },
      {
        headerName: '% Growth', type: 'percent',
        valueGetter: params => {
          return (params.getValue('LY') > 0) ? (params.getValue('FY') - params.getValue('LY')) / params.getValue('LY') : null;
        }
      }
    ];

  }

}

function minDate(values) {
  let result = values[0];
  values.forEach(value => {
      result = (value < result) ? value : result;
    }
  );
  return result;
}
