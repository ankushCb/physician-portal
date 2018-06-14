import * as d3 from 'd3';
import moment from 'moment';

import reduce from 'lodash/reduce';

import * as styles from './style.scss';
import * as iconStyles from '../../Icon/styles.scss';
import { axisBottom } from 'd3';

class diabetesOverviewGraph {

  constructor(domNode) {
    this.domNode = domNode;
    this.width = 928.5;
    this.height = 500;
    this.graphMargin = {
      top: 30,
      right: 250,
      bottom: 30,
      left: 35,
    };

    this.xAxisOffset = 90;
  }

  precalculate(data, type, monthNumber) {

    if (type === 'Week') {
      this.count = 7;
    } else {
      this.count = 30;
    }
    this.diabetesMax = d3
      .max(data, d => 100 * Math.floor(2 * d.value / 100));
    this.rectanglePopup = {
      width: 170,
      height: 150,
      xOffset: 140,
      dataXOffset: 70,
      dataYOffset: line => line * 40,
      yOffset: 75,
    };
    // Calcultes X scale for size
    this.calculateXScale(type, monthNumber);
  }

  createSvg() {
    this.graph = d3.select(this.domNode)
      .append('svg')
      .attr('class', 'graph')
      .attr('width', this.width)
      .attr('height', this.height)
  }

  calculateXScale(type, monthNumber) {
    if (type === 'Week') {
      // Calculates day count vs day
      this.dayScale = d3
        .scaleOrdinal()
        .domain(Array.from(new Array(this.count),(val,index)=>index))
        .range(['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']);

      this.xScale = d3
        .scaleLinear()
        .domain([0, 6])
        .range([this.xAxisOffset, this.xAxisOffset + this.width - (this.graphMargin.right + this.graphMargin.left)]);
      this.diabetesMax = this.diabetesMax !== 0 ? this.diabetesMax : 100;
      this.yScale = d3
        .scaleLinear()
        .domain([this.diabetesMax, 0])
        .range([this.graphMargin.top, this.height - this.graphMargin.bottom]);
    } else if (type === 'Month') {
      this.dayScale = d3
        .scaleOrdinal()
        .domain(Array.from(new Array(this.count),(val,index)=>index))
        .range(Array.from(new Array(this.count),(val,index)=>index));
      this.xScale = d3
        .scaleLinear()
        .domain([0, this.count - 1])
        .range([this.xAxisOffset, this.xAxisOffset + this.width - (this.graphMargin.right + this.graphMargin.left)]);
      this.diabetesMax = this.diabetesMax !== 0 ? this.diabetesMax : 100;
      this.yScale = d3
        .scaleLinear()
        .domain([this.diabetesMax, 0])
        .range([this.graphMargin.top, this.height - this.graphMargin.bottom]);
    }
  }

  drawAxis() {
    // Removing regular ticks
    let xAxis = axisBottom(this.xScale)
      .ticks(this.count)
      .tickFormat('');

    const yAxis = d3
      .axisLeft(this.yScale)
      .ticks(5)
      .tickFormat(x => { return x; });

    // Y axis naming
    this.graph
      .append('g')
      .attr('transform', `translate(${this.graphMargin.left}, 0)`)
      .call(yAxis);

    // X Axis Naming
    this.graph
      .append('g')
      .attr('transform', `translate(${this.graphMargin.left}, ${this.height - this.graphMargin.bottom})`)
      .attr('class', 'diabetes-x-axis')
      .call(xAxis)
    
    this.graph
      .select('.diabetes-x-axis')
      .selectAll('g.tick')
      .append('svg:foreignObject')
      .attr('width', 5)
      .attr('height', 5)
      .attr('x', -13)
      .attr('y', 10)
      .append('xhtml:div')
      .attr('class', 'my-x-axis-label-2')
      .html((x) => {
        if (this.count !== 7) {
          if (x % 3 === 0) {
            return moment().startOf('day').subtract({ days: x }).format('MM/DD');
          }
        } else if (this.count === 7) {
          return moment().startOf('day').subtract({ days: x }).format('MM/DD');
        }
      });

  }

  drawGridLines() {
    var gridLinesY = d3
      .axisLeft()
      .ticks(7)
      .tickSize(-this.width)
      .tickFormat('')
      .scale(this.yScale);

    this.graph
      .append('g')
      .attr('class', 'minor-gridline')
      .attr('transform', `translate(${this.graphMargin.left}, 0)`)
      .call(gridLinesY)
      .style('pointer-events', 'all')
      .on('click', (a, b, c, d) => {
        this.removeMarker();
      });;

  }

  drawGraph(data) {
    let dottedLineData = reduce(data, (accumulator, eachItem, index) => {
      if (accumulator.isOnZeroChain && eachItem.value === 0) {
        return accumulator;
      }
      if (accumulator.isOnZeroChain && eachItem.value !== 0) {
        const bufferArray = accumulator.result;
        bufferArray.push({
          value: eachItem.value,
          index,
        });
        accumulator.result = bufferArray;
        accumulator.isOnZeroChain = false;
        return accumulator;
      }
      if (!accumulator.isOnZeroChain && eachItem.value !== 0) {
        const bufferArray = accumulator.result;
        bufferArray.push({
          value: eachItem.value,
          index,
        });
        accumulator.result = bufferArray;
        return accumulator;
      }
      if (eachItem.value === 0) {
        accumulator.isOnZeroChain = true;
        return accumulator;
      }
    }, {
      result: [],
      isOnZeroChain: false,
    });
    let dottedPathData;

    dottedPathData = dottedLineData.result;

    const dottedLineFunction = d3
      .line()
      .defined(d => d.value !== 0)
      .x((d) => this.graphMargin.left + this.xScale(d.index))
      .y((d) => {
        return this.yScale(d.value)
      });

    // Draws the dotted line
    this.graph
      .append('g')
      .attr('class', 'dia-dotted-line-path')
      .append('path')
      .datum(dottedPathData)
      .attr('class', 'dotted-line')
      .attr('stroke-dasharray', ("3, 3"))
      .attr('d', dottedLineFunction)
    // Draws the line using path

    // Draw the complete line. This is the original line
    // line x y position function
    const lineFunction = d3
      .line()
      .defined(d => d.value !== 0)
      .x((d, i) => this.graphMargin.left + this.xScale(i))
      .y((d) => {
        return this.yScale(d.value)
      });

    // Line path for the data
    this.graph
      .append('g')
      .attr('class', 'dia-line-path')
      .append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', lineFunction)

    // Draws the icons
    this.graph
      .append('g')
      .selectAll('.symbol')
      .data(data)
      .enter()
      .append('svg:foreignObject')
      .attr("width", 100)
      .attr("height", 100)
      .attr('x', (d, i) => {
          return this.graphMargin.left + this.xScale(i) - 5;
      })
      .attr('y', (d) => {
        if (d.value !== 0) {
          return this.yScale(d.value) - 10;
        } else {
          return -10000;
        }
      })
      .append("xhtml:div")
      .attr('class', ({ value }) => {
        if (value <= 0) {
          return 'symbol hidden';
        }
        else if (value < this.hypo) {
          return 'symbol diabetes-hypo';
        }
        else if (value >= this.hyper && value < this.extreme) {
          return 'symbol diabetes-hyper';
        } else if (value >= this.extreme) {
          return 'symbol diabetes-extreme';
        } else {
          return 'symbol';
        }
      })
      .html(({ value }) => {
        if (value >= this.extreme) {
          return `<i class="${iconStyles['icon']} graph-icon-basic icon-warning"></i>`
        } else {
          return `<i class="${iconStyles['icon']} graph-icon-basic icon-radio-off"></i>`
        }
      })

      // Plot icons for all the symbols
      this.graph
        .selectAll('.symbol')
        .style('pointer-events', 'all')
        .on('click', (a, b, c) => {
          // console.log('a b c', a, b, c)
          this.plotMarker(data, b);
        });
  }

  plotMarker(data, index) {
    // Removes any rectangle already popped up
    this.graph
      .selectAll('.rectangle-popup')
      .remove();

    // Removes all text popup if exists
    this.graph
      .selectAll('.text-popup')
      .remove();

    this.graph
      .selectAll('.day-line')
      .remove();

    this.graph
      .selectAll('.popup-icon')
      .remove();

    // const lineFunction = d3
    //   .line()
    //   .x(() => this.graphMargin.left + this.xScale(index))
    //   .y((d) => this.yScale(d.y));
    // this.graph
    //   .append('path')
    //   .attr('class', 'day-line')
    //   .datum([{ y: 0 }, { y: this.diabetesMax ? Math.floor(2 * this.diabetesMax / 3) : 100 }])
    //   .attr('fill', 'none')
    //   .attr('stroke', 'black')
    //   .attr('stroke-width', 2)
    //   .attr('d', lineFunction);

    // Adds a Rectangle popup
    this.graph
      .append('g')
      .selectAll('.rectangle-popup')
      .data([data[index]])
      .enter()
      .append('rect')
      .attr('class', 'rectangle-popup')
      .attr('x', () => (120 + this.xScale(index) + this.xAxisOffset - this.rectanglePopup.xOffset))
      .attr('y', ({ value }) => {
        // If the rectangle crosses y axis negatively
        const rectangleYPosition = ((this.yScale(value) + this.rectanglePopup.yOffset) 
        + (this.rectanglePopup.height) < this.height) ? (this.yScale(value) + this.rectanglePopup.yOffset - this.rectanglePopup.height) : (this.height - this.rectanglePopup.height - 30);
        return rectangleYPosition;
      })
      .attr('width', this.rectanglePopup.width)
      .attr('height', this.rectanglePopup.height)
      .attr('stroke', '#e2e2e2')
      .attr('fill', 'white')
      .attr('stroke-width', 2)
    // Add currently clicked date
    const popupBindedGraph = this.graph
      .append('g')
      .selectAll('.rectangle-popup')
      .data([data[index]])
      .enter();
    
    // Do
    popupBindedGraph
      .append('text')
      .attr('class', 'text-popup')
      .attr('x', () => (120 + this.xScale(index) + this.xAxisOffset - this.rectanglePopup.dataXOffset - 30))
      .attr('y', ({ value }) => {
        const rectangleYPosition = ((this.yScale(value) + this.rectanglePopup.yOffset) 
        + (this.rectanglePopup.height) < this.height) ? (this.yScale(value) + this.rectanglePopup.yOffset - this.rectanglePopup.height) : (this.height - this.rectanglePopup.height - 30);
        return rectangleYPosition + this.rectanglePopup.dataYOffset(1);
      })
      .attr('stroke', '#9b9b9b')
      .text(({ date }) => {
        return moment(date, 'YYYY-MM-DD').format('MM/DD')
      })

    popupBindedGraph
      .append('svg:foreignObject')
      .attr("width", 100)
      .attr("height", 100)
      .attr('x', () => (120 + this.xScale(index) + this.xAxisOffset - this.rectanglePopup.dataXOffset) - 30)
      .attr('y', ({ value }) => {
        const rectangleYPosition = ((this.yScale(value) + this.rectanglePopup.yOffset) 
        + (this.rectanglePopup.height) < this.height) ? (this.yScale(value) + this.rectanglePopup.yOffset - this.rectanglePopup.height) : (this.height - this.rectanglePopup.height - 30);
        return rectangleYPosition + 60; // 60 is the offset - investigate why ...
      })
      .append("xhtml:div")
      .attr('class', 'popup-icon')
      .html("<span class='bg'>BG</span>")

    popupBindedGraph
      .append('svg:foreignObject')
      .attr("width", 100)
      .attr("height", 100)
      .attr('x', () => (120 + this.xScale(index) + this.xAxisOffset - this.rectanglePopup.dataXOffset) - 30)
      .attr('y', ({ value }) => {
        const rectangleYPosition = ((this.yScale(value) + this.rectanglePopup.yOffset) 
        + (this.rectanglePopup.height) < this.height) ? (this.yScale(value) + this.rectanglePopup.yOffset - this.rectanglePopup.height) : (this.height - this.rectanglePopup.height - 30);
        return rectangleYPosition + 60 + this.rectanglePopup.dataYOffset(1); // 60 is the offset - investigate why ...
      })
      .append("xhtml:div")
      .attr('class', 'popup-icon')
      .html(`<i class="${iconStyles['icon']} icon-bg"></i>`)

    // Adds line 1
    
    popupBindedGraph
      .append('text')
      .attr('class', 'text-popup')
      .attr('x', () => (120 + this.xScale(index) + this.xAxisOffset - this.rectanglePopup.dataXOffset))
      .attr('y', ({ value }) => {
        const rectangleYPosition = ((this.yScale(value) + this.rectanglePopup.yOffset) 
        + (this.rectanglePopup.height) < this.height) ? (this.yScale(value) + this.rectanglePopup.yOffset - this.rectanglePopup.height) : (this.height - this.rectanglePopup.height - 30);
        return rectangleYPosition + this.rectanglePopup.dataYOffset(2);
      })
      .text(z => z.value)
    
    popupBindedGraph
      .append('text')
      .attr('class', 'text-popup')
      .attr('x', () => (120 + this.xScale(index) + this.xAxisOffset - this.rectanglePopup.dataXOffset))
      .attr('y', ({ value }) => {
        const rectangleYPosition = ((this.yScale(value) + this.rectanglePopup.yOffset) 
        + (this.rectanglePopup.height) < this.height) ? (this.yScale(value) + this.rectanglePopup.yOffset - this.rectanglePopup.height) : (this.height - this.rectanglePopup.height - 30);
        return rectangleYPosition + this.rectanglePopup.dataYOffset(3);
      })
      .text(z => z.bgChecks)
  }

  removeMarker() {
    this.graph
      .selectAll('.rectangle-popup')
      .remove();

    this.graph
      .selectAll('.popup-icon')
      .remove();

    // Removes all text popup if exists
    this.graph
      .selectAll('.text-popup')
      .remove();

    this.graph
      .selectAll('.day-line')
      .remove();
  }

  removeAllPlot() {
    d3
      .select('svg')
      .remove();
    this.graph = null;
  }

  initializeGraph(data, type) {

    // Precalculates everything
    this.precalculate(data, type);
    // Creates a svg with width and height
    this.createSvg();
    // Draw axis
    this.drawAxis();
    // Draw Grid lines
    this.drawGridLines();
    // Plot lines
    this.drawGraph(data);

  }

  plot(data, type, hypo, hyper, extreme) {
    this.hypo = hypo;
    this.hyper = hyper;
    this.extreme = extreme;
    this.initializeGraph(data, type);
  }

}

export default diabetesOverviewGraph;
