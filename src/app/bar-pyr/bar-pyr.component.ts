import { Component, OnInit } from '@angular/core';
import { DataService }       from '../data.service';
import barPyramid            from '../../assets/barPyramid.json';
import * as d3               from 'd3';

@Component({
  selector: 'app-bar-pyr',
  templateUrl: './bar-pyr.component.html',
  styleUrls: ['./bar-pyr.component.scss']
})
export class BarPyrComponent implements OnInit {

  currentView: string;
  selectedQtr: number;

  private sourceData = barPyramid['SASTableData+BARPYRAMID'];
  private width = 400;
  private height = 300;
  private margin = 20;

  private svg;
  private gChartArea;
  private yAxisComponent;
  private xAxisComponent;
  private x2AxisComponent;

  constructor(private data: DataService) {
  }

  ngOnInit(): void {
    this.data.currentViewMode.subscribe(viewMode => {
      this.currentView = viewMode;
      this.reDraw();
    });
    this.data.currentQuarter.subscribe(quarter => {
      this.selectedQtr = quarter;
      this.reDraw();
    });

  }

  aggregateData(data: any, viewMode: string, quarter: number) {
    const resultData = [];
    data.forEach((d) => {
      if (((viewMode === 'quarter-view') && (d.quarter === quarter)) || ((viewMode === 'cumulative-view') && (d.quarter <= quarter))) {
        const i = resultData.map(e => e.lvl).indexOf(d.lvl.toLocaleString());
        if (i >= 0) {
          resultData[i]['last_submit'] += d.last_submit;
          resultData[i]['latest_rollup'] += d.latest_rollup;
        } else {
          const tmpObj = {lvl: d.lvl.toLocaleString(), last_submit: d.last_submit, latest_rollup: d.latest_rollup};
          resultData.push(tmpObj);
        }
      }
    });
    return resultData;
  }

  reDraw() {

    const transTime = 500;
    // Get the data
    const graphData = this.aggregateData(this.sourceData, this.currentView, this.selectedQtr);


    // Add or update svg and g
    this.svg = d3.select('.bar-pyr')
      .attr('width', this.width)
      .attr('height', this.height)
    ;

    this.svg.selectAll('.graph-label').data([graphData])
      .enter()
      .append('text')
      .classed('graph-label', true)
      .text('NR Coverage Pyramid')
      .style('font-size', 16)
      .style('font-weight', 'bold')
      .style('text-anchor', 'start')
      .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')')
    ;

    this.svg.selectAll('.g-chart-area')
      .data([graphData])
      .enter()
      .append('g')
      .classed('g-chart-area', true)
      .attr('width', this.width)
      .attr('height', this.height)
    ;

    this.gChartArea = this.svg.select('.g-chart-area');

    const yScale = d3.scaleBand();
    const xScale = d3.scaleLinear();
    const x2Scale = d3.scaleLinear();

    // Create y scale - for shared category
    yScale
      .domain(graphData.map(d => d.lvl))
      .range([2 * this.margin, this.height - 3 * this.margin])
      .padding(0.1);


    // Create x scale - for left axis

    xScale
      .domain([0, d3.max(graphData, d => Math.max(d.last_submit, d.latest_rollup))])
      .range([this.width / 2, this.margin]);

    // Create x2 scale - for right axis

    x2Scale
      .domain([0, d3.max(graphData, d => Math.max(d.last_submit, d.latest_rollup))]) // input
      .range([this.width / 2, this.width - this.margin]); // output

    // Create axes components
    this.yAxisComponent = d3.axisLeft(yScale);
    this.xAxisComponent = d3.axisBottom(xScale).ticks(5, '~s');
    this.x2AxisComponent = d3.axisBottom(x2Scale).ticks(5, '~s');

    // Create y Axis
    const yAxis = this.gChartArea.selectAll('.y-axis').data([graphData]);
    yAxis.enter()
      .append('g')
      .classed('y-axis', true)
      .merge(yAxis)
      .attr('transform', 'translate(' + this.width / 2 + ',' + 0 + ')')
      .call(this.yAxisComponent);

    // Create left x axis
    const xAxis = this.gChartArea.selectAll('.x-axis').data([graphData]);
    xAxis.enter()
      .append('g')
      .classed('x-axis', true)
      .merge(xAxis)
      .attr('transform', 'translate(' + 0 + ',' + (this.height - 3 * this.margin) + ')')
      .call(this.xAxisComponent)
    ;

    this.gChartArea.selectAll('.x-axis-label').data([graphData])
      .enter()
      .append('text')
      .classed('x-axis-label', true)
      .text('Last Submit')
      .style('font-size', 14)
      .style('font-weight', 'bold')
      .style('text-anchor', 'middle')
      .attr('transform', 'translate(' + this.width / 4 + ',' + (this.height - this.margin) + ')');

    // Create right x axis
    const x2Axis = this.gChartArea.selectAll('.x2-axis').data([graphData]);
    x2Axis.enter()
      .append('g')
      .classed('x2-axis', true)
      .merge(x2Axis)
      .attr('transform', 'translate(' + 0 + ',' + (this.height - 3 * this.margin) + ')')
      .call(this.x2AxisComponent)
    ;

    this.gChartArea.selectAll('.x2-axis-label').data([graphData])
      .enter()
      .append('text')
      .classed('x2-axis-label', true)
      .text('Latest Rollup')
      .style('font-size', 14)
      .style('font-weight', 'bold')
      .style('text-anchor', 'middle')
      .attr('transform', 'translate(' + 3 * this.width / 4 + ',' + (this.height - this.margin) + ')');

    // Update bars for last submit

    const barsLs = this.gChartArea.selectAll('.data-bar-ls').data(graphData, d => d.lvl);
    barsLs.transition()
      .duration(transTime)
      .attr('x', d => xScale(d.last_submit))
      .attr('y', d => yScale(d.lvl))
      .attr('height', yScale.bandwidth())
      .attr('width', d => xScale(0) - xScale(d.last_submit))
      .style('opacity', 0.7);

    barsLs.enter()
      .append('rect')
      .classed('data-bar-ls', true)
      .attr('x', d => xScale(d.last_submit))
      .attr('y', d => yScale(d.lvl))
      .attr('height', yScale.bandwidth())
      .attr('width', d => xScale(0) - xScale(d.last_submit))
      .style('fill', '#4682b4')
      .style('opacity', 0.7);

    barsLs.exit()
      .remove();

    /* Update labels for last submit */

    const labelsLs = this.gChartArea.selectAll('.label-bar-ls').data(graphData, d => d.lvl);
    /* Update existing labels */
    labelsLs.transition()
      .duration(transTime)
      .text(d => d.last_submit.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
      .attr('transform', d => {
        return 'translate(' + ((xScale(d.last_submit) + xScale(0)) / 2) + ',' + (yScale(d.lvl) + yScale.bandwidth() / 2) + ')';
      })
    ;
    /* Add new labels */
    labelsLs.enter()
      .append('text')
      .classed('label-bar-ls', true)
      .text(d => d.last_submit.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
      .attr('transform', d => {
        return 'translate(' + ((xScale(d.last_submit) + xScale(0)) / 2) + ',' + (yScale(d.lvl) + yScale.bandwidth() / 2) + ')';
      })
      .style('text-anchor', 'middle')
      .style('font-size', 12)
      .style('opacity', 1)
    ;
    labelsLs.exit()
      .remove();

    // Update bars for Latest Rollup


    const barsLr = this.gChartArea.selectAll('.data-bar-lr').data(graphData, d => d.lvl);
    barsLr.transition()
      .duration(transTime)
      .attr('x', x2Scale(0))
      .attr('y', d => yScale(d.lvl))
      .attr('height', yScale.bandwidth())
      .attr('width', d => x2Scale(d.latest_rollup) - x2Scale(0))
      .style('fill', '#008000')
      .style('opacity', 0.7)
    ;

    barsLr.enter()
      .append('rect')
      .classed('data-bar-lr', true)
      .attr('x', x2Scale(0))
      .attr('y', d => yScale(d.lvl))
      .attr('height', yScale.bandwidth())
      .attr('width', d => x2Scale(d.latest_rollup) - x2Scale(0))
      .style('fill', '#008000')
      .style('opacity', 0.7)
    ;

    barsLr.exit()
      .remove();

    // Labels for latest rollup
    const labelsLr = this.gChartArea.selectAll('.label-bar-lr').data(graphData, d => d.lvl);
    /* Update existing labels */
    labelsLr.transition()
      .duration(transTime)
      .text(d => d.latest_rollup.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
      .attr('transform', d => {
        return 'translate(' + ((x2Scale(d.latest_rollup) + x2Scale(0)) / 2) + ',' + (yScale(d.lvl) + yScale.bandwidth() / 2) + ')';
      })
    ;
    /* Add new labels */
    labelsLr.enter()
      .filter(d => (d.latest_rollup > 0))
      .append('text')
      .classed('label-bar-lr', true)
      .text(d => d.latest_rollup.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
      .attr('transform', d => {
        return 'translate(' + ((x2Scale(d.latest_rollup) + x2Scale(0)) / 2) + ',' + (yScale(d.lvl) + yScale.bandwidth() / 2) + ')';
      })
      .style('text-anchor', 'middle')
      .style('font-size', 12)
      .style('opacity', 1)
    ;
    labelsLr.exit()
      .remove()
    ;
  }
}
