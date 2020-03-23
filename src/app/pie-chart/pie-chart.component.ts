import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { DataService } from "../data.service";
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements AfterViewInit {
  @Input() pieName: string;
  @Input() pieClass: string;
  @Input() categoryName: string;
  @Input() sourceData: any;

  currentView: string;
  selectedQtr: number;
  private width = 400;
  private height = 300;
  private margin = 20;

  private svg;
  private gChartArea;

  constructor(private data: DataService) { }


  ngAfterViewInit(): void {
    this.data.currentViewMode.subscribe(viewMode => {
      this.currentView = viewMode;
      if (this.selectedQtr) {this.reDraw(this.categoryName);}
    });
    this.data.currentQuarter.subscribe(quarter=>{
      this.selectedQtr = quarter;
      this.reDraw(this.categoryName);
    });
  }

  aggregateData(data: any, categoryName: string, viewMode: string, quarter: number) {
    var resultData=[];
    data.forEach((d)=>{
      if (((viewMode=="quarter-view")&&(d.quarter==quarter))||((viewMode=="cumulative-view")&&(d.quarter<=quarter))) {
        var i = resultData.map(e=>e[categoryName]).indexOf(d[categoryName]);
        if (i>=0) {
          resultData[i]['last_submit']+=d.last_submit;
          resultData[i]['latest_rollup']+=d.latest_rollup;
        }
        else {
          var tmpObj = {};
          tmpObj[categoryName]= d[categoryName];
          tmpObj['last_submit'] = d.last_submit;
          tmpObj['latest_rollup'] = d.latest_rollup;
          resultData.push(tmpObj);
        }
      }
    } );
    return resultData;
  }

  reDraw(categoryName: string) {
    var radius = 0.9*Math.min(this.width, this.height) / 2 - 2*this.margin
    var transTime = 500;
    // Get the data
    var graphData = this.aggregateData(this.sourceData, categoryName, this.currentView, this.selectedQtr)
    console.log(graphData);
    // set the color scale
    var color = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(graphData.map(d=>d[categoryName]))
    ;
 
    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .value(function(d) {return d.last_submit; })
    var data_ready = pie(graphData);
    
    // Add or update svg and g
    this.svg = d3.select("." + this.pieClass)
      .attr("width", this.width)
      .attr("height", this.height)
    ;
    console.log(this.svg);

    this.svg.selectAll(".graph-label").data([graphData])
      .enter()
      .append("text")
      .classed("graph-label", true)
      .text(this.pieName)
      .style("font-size", 16)
      .style("font-weight", "bold")
      .style("text-anchor", "start")
      .attr("transform", "translate("+ this.margin + "," + this.margin + ")")
    ;

    this.svg.selectAll(".g-chart-area")
      .data([data_ready])
      .enter()
      .append("g")
      .classed("g-chart-area", true)
      .attr("transform", "translate(" + 0.45*this.height + "," + this.height / 2 + ")")
    ;
  
    this.gChartArea = this.svg.select(".g-chart-area");

    // shape helper to build arcs:
    var arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    /* Update pie chart */
    var slices=this.gChartArea.selectAll(".slice").data(data_ready, function(d) {
        return d.data[categoryName];
    });
 
    /* Add new slices */  
    slices.enter()
      .append("path")
      .classed("slice", true)
      .attr('d', arcGenerator)
      .attr('fill', function(d){ return(color(d.data[categoryName])) })
      .attr("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", 0.7)
    ;

    slices		
    .transition().duration(transTime)
    .attr('fill', function(d){ return(color(d.data[categoryName])) })
		.attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arcGenerator(interpolate(t));
			};
		});
    /* Remove excluded elements */
    slices.exit()
      .remove()
    ;      
    
    /* Update labels */
    this.gChartArea.selectAll(".label").remove();
    var labels=this.gChartArea.selectAll(".label").data(data_ready, function(d) {
      return d.data[categoryName];
    });
    /* Add new labels */  
    labels.enter()
      .filter(d => (d.endAngle - d.startAngle) > 0.35)
      .append('text')
      .classed("label", true)
      .text(d => {return d.data.last_submit.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
          })
      .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
      .style("text-anchor", "middle")
      .style("font-size", 12)
      .style("opacity", 0)
      .transition()
      .duration(transTime)
      .style("opacity", 1)
    ;
    
    // Update legend

    var height = this.margin;
    var coordinates = {};

    for (var i=0;i<data_ready.length; ++i)
    {
      var obj={};
      if ((data_ready[i].endAngle - data_ready[i].startAngle) > 0.35) {
        obj = {'y_r': height + 15, 'y_t': height + 25};
        height+=20;
      }
      else {
        obj = {'y_r': height + 20, 'y_t': height + 25};
        height+=32;
      }
      coordinates[data_ready[i].data[categoryName]]=obj;
    }
    // Rectangles
    this.svg.selectAll(".legend-rect").remove();
    var legend_rect=this.svg.selectAll(".legend-rect").data(data_ready, function(d) {
      return d.data[categoryName];
    });
    legend_rect.enter()
      .append('rect')
      .classed('legend-rect', true)
      .style('fill', function(d) {return color(d.data[categoryName])})
      .attr('x', 0.9*this.height-this.margin)
      .attr('y', function(d,i) {return coordinates[d.data[categoryName]].y_r} )
      .attr('width',15)
      .attr('height', 15)
    ;
    //Text
    this.svg.selectAll(".legend-text").remove();
    var legend_text=this.svg.selectAll(".legend-text").data(data_ready, function(d) {
      return d.data[categoryName];
    });
    legend_text.enter()
      .append('text')
      .classed('legend-text', true)
      .call(text => text.append("tspan")
          .attr('x', 0.9*this.height-this.margin + 20)
          .attr('y', function(d) {return coordinates[d.data[categoryName]].y_t} )
          .attr("font-weight", "bold")
          .text(function(d){ 
            if (d.data.last_submit > d.data.latest_rollup) {
              return d.data[categoryName] + " \u21D1"
            } 
            else {
              return d.data[categoryName] + " \u21D3"
            }})
      )
      .call(text => text.filter(d => (d.endAngle - d.startAngle) <= 0.35).append("tspan")
          .attr('x', 0.9*this.height - this.margin + 20)
          .attr('y', function(d) {return coordinates[d.data[categoryName]].y_t + 15} )
          .attr("fill-opacity", 0.7)
          .text(d => d.data.last_submit.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
      )
      .style('font-size', 10)
    ;

    
  };

}
