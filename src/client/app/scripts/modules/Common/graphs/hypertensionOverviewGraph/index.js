import * as d3 from 'd3';
import moment from 'moment';

import reduce from 'lodash/reduce';

import * as styles from './style.scss';
import * as iconStyles from '../../Icon/styles.scss';

class diabetesOverviewGraph {

  constructor(domNode) {
    this.domNode = domNode;
    this.width = 928.5;
    this.height = 500;
    this.graphMargin = {
      top: 30,
      right: 250,
      bottom: 30,
      left: 30,
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
      .max(data, d => 100 * Math.floor(2 * d.valueSystolic / 100));
    this.rectanglePopup = {
      width: 170,
      height: 150,
      xOffset: 140,
      dataXOffset: 70,
      dataYOffset: line => line * 40,
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
    let xAxis;
    if (this.count !== 7) {
      xAxis = d3
      .axisBottom(this.xScale)
      .ticks(this.count)
      .tickFormat('');
    } else {
      xAxis = d3
        .axisBottom(this.xScale)
        .ticks(this.count)
        .tickFormat((x) => {
          return moment().startOf('day').subtract({days: x}).format('ddd');
        });
    }
    const yAxis = d3
      .axisLeft(this.yScale)
      .ticks(5)
      .tickFormat(x => { return x; });

    this.graph
      .append('g')
      .attr('transform', `translate(${this.graphMargin.left}, 0)`)
      .call(yAxis);

    this.graph
      .append('g')
      .attr('transform', `translate(${this.graphMargin.left}, ${this.height - this.graphMargin.bottom})`)
      .attr('class', 'diabetes-x-axis')
      .call(xAxis)
    this.graph
      .select('.diabetes-x-axis')
      .selectAll('g.tick')
      .append('svg:foreignObject')
      .attr('width',5)
      .attr('height',5)
      .attr('x', -13)
      .attr('y', 20)
      .append('xhtml:div')
      .attr('class', 'my-x-axis-label-2')
      .html((x) => {
        if (this.count !== 7) {
          if (x % 2 === 0) {
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
    // Systolic missing line
    let dottedLineSystolicData = reduce(data, (accumulator, eachItem, index) => {
      if (accumulator.isOnZeroChain && eachItem.valueSystolic === 0) {
        return accumulator;
      }
      if (accumulator.isOnZeroChain && eachItem.valueSystolic !== 0) {
        const bufferArray = accumulator.result;
        bufferArray.push({
          value: eachItem.valueSystolic,
          index,
        });
        accumulator.result = bufferArray;
        accumulator.isOnZeroChain = false;
        return accumulator;
      }
      if (!accumulator.isOnZeroChain && eachItem.valueSystolic !== 0) {
        const bufferArray = accumulator.result;
        bufferArray.push({
          value: eachItem.valueSystolic,
          index,
        });
        accumulator.result = bufferArray;
        return accumulator;
      }
      if (eachItem.valueSystolic === 0) {
        accumulator.isOnZeroChain = true;
        return accumulator;
      }
    }, {
      result: [],
      isOnZeroChain: false,
    });
    let dottedSystolicPathData;
    if (dottedLineSystolicData.result.length > 0 && dottedLineSystolicData.result[0].index !== 0) {
      const initialValue = {
        value: dottedLineSystolicData.result[0].value,
        index: 0,
      };
       dottedSystolicPathData = [initialValue].concat(dottedLineSystolicData.result);
    } else {
      dottedSystolicPathData = dottedLineSystolicData.result;
    }

    // Diastolic missing line
    let dottedLineDiastolicData = reduce(data, (accumulator, eachItem, index) => {
      if (accumulator.isOnZeroChain && eachItem.valueDiastolic === 0) {
        return accumulator;
      }
      if (accumulator.isOnZeroChain && eachItem.valueDiastolic !== 0) {
        const bufferArray = accumulator.result;
        bufferArray.push({
          value: eachItem.valueDiastolic,
          index,
        });
        accumulator.result = bufferArray;
        accumulator.isOnZeroChain = false;
        return accumulator;
      }
      if (!accumulator.isOnZeroChain && eachItem.valueDiastolic !== 0) {
        const bufferArray = accumulator.result;
        bufferArray.push({
          value: eachItem.valueDiastolic,
          index,
        });
        accumulator.result = bufferArray;
        return accumulator;
      }
      if (eachItem.valueDiastolic === 0) {
        accumulator.isOnZeroChain = true;
        return accumulator;
      }
    }, {
      result: [],
      isOnZeroChain: false,
    });
    let dottedDiastolicPathData;
    if (dottedLineDiastolicData.result.length > 0 && dottedLineDiastolicData.result[0].index !== 0) {
      const initialValue = {
        value: dottedLineDiastolicData.result[0].value,
        index: 0,
      };
       dottedDiastolicPathData = [initialValue].concat(dottedLineDiastolicData.result);
    } else {
      dottedDiastolicPathData = dottedLineDiastolicData.result;
    }
    const dottedLineFunctionSystolic = d3
      .line()
      .defined(d => d.valueSystolic !== 0)
      .x((d, i) => this.graphMargin.left + this.xScale(d.index))
      .y((d) => {
        return this.yScale(d.value)
      });

    const dottedLineFunctionDiastolic = d3
      .line()
      .defined(d => d.valueSystolic !== 0)
      .x((d, i) => this.graphMargin.left + this.xScale(d.index))
      .y((d) => {
        return this.yScale(d.value)
      });

      this.graph
        .append('g')
        .attr('class', 'dotted-systolic-line-path')
        .append('path')
        .datum(dottedSystolicPathData)
        .attr('class', 'dotted-line')
        .attr('stroke-dasharray', ("3, 3"))
        .attr('d', dottedLineFunctionSystolic)

      this.graph
        .append('g')
        .attr('class', 'dotted-diastolic-line-path')
        .append('path')
        .datum(dottedDiastolicPathData)
        .attr('class', 'dotted-line')
        .attr('stroke-dasharray', ("3, 3"))
        .attr('d', dottedLineFunctionDiastolic)

    const lineFunctionSystolic = d3
      .line()
      .defined(d => d.valueSystolic !== 0)
      .x((d, i) => this.graphMargin.left + this.xScale(i))
      .y((d) => {
        return this.yScale(d.valueSystolic)
      });

    const lineFunctionDiastolic = d3
      .line()
      .defined(d => d.valueSystolic !== 0)
      .x((d, i) => this.graphMargin.left + this.xScale(i))
      .y((d) => {
        return this.yScale(d.valueDiastolic)
      });

    // Draws the systolic line using path
    this.graph
      .append('g')
      .attr('class', 'line-path')
      .append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', lineFunctionSystolic)

    // Draws the line using path
    this.graph
      .append('g')
      .attr('class', 'line-path')
      .append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', lineFunctionDiastolic)

    this.graph
      .append('g')
      .selectAll('.symbol')
      .data(data)
      .enter()
      .append('svg:foreignObject')
      .attr("width", 100)
      .attr("height", 100)
      .attr('x', (d, i) => {
        if (d.value !== 0) {
          return this.graphMargin.left +this.xScale(i) - 6;
        } else {
          return -1000;
        }
      })
      .attr('y', (d) => {
        if (d.value !== 0) {
          return this.yScale(d.valueSystolic) - 8;
        } else {
          return -1000;
        }
      })
      .append("xhtml:div")
      .attr('class', ({ valueSystolic: value, ...d }) => {
        if (value <= 0) {
          return 'symbol hypertension-zero';
        }
        else if (value < this.hypoSys) {
          return 'symbol hypertension-hypo';
        }
        else if (value >= this.hyperSys && value < this.extreme) {
          return 'symbol hypertension-hyper';
        } else if (value >= this.extreme) {
          return 'symbol hypertension-extreme';
        } else {
          return 'symbol';
        }
      })    
      .html(`<i class="${iconStyles['icon']} icon-radio-off"></i>`)

      this.graph
        .append('g')
        .selectAll('.symbol')
        .data(data)
        .enter()
        .append('svg:foreignObject')
        .attr("width", 100)
        .attr("height", 100)
        .attr('x', (d, i) => {
          if (d.value !== 0) {
            return this.graphMargin.left +this.xScale(i) - 6;
          } else {
            return -1000;
          }
        })
        .attr('y', (d) => {
          if (d.value !== 0) {
            return this.yScale(d.valueDiastolic) - 8;
          } else {
            return -1000;
          }
        })
        .append("xhtml:div")
        .attr('class', ({ valueDiastolic: value }) => {
          if (value <= 0) {
            return 'symbol hypertension-zero';
          }
          else if (value < this.hypoDia) {
            return 'symbol hypertension-hypo';
          }
          else if (value >= this.hyperDia && value < this.extreme) {
            return 'symbol hypertension-hyper';
          } else if (value >= this.extreme) {
            return 'symbol hypertension-extreme';
          } else {
            return 'symbol';
          }
        })   
        .html(`<i class="${iconStyles['icon']} icon-radio-off"></i>`)

      this.graph
        .selectAll('.symbol')
        .style('pointer-events', 'all')
        .on('click', (a, b, c) => {
          this.plotMarker(data, b % this.count);
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

    const lineFunction = d3
      .line()
      .x(() => this.graphMargin.left + this.xScale(index))
      .y((d) => this.yScale(d.y));
    this.graph
      .append('path')
      .attr('class', 'day-line')
      .datum([{ y: 0 }, { y: this.diabetesMax ? Math.floor(2 * this.diabetesMax / 3) : 100 }])
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('d', lineFunction);

    // Adds a Rectangle popup
    this.graph
      .append('g')
      .selectAll('.rectangle-popup')
      .data([data[index]])
      .enter()
      .append('rect')
      .attr('class', 'rectangle-popup')
      .attr('x', () => (this.xScale(index) + this.xAxisOffset - this.rectanglePopup.xOffset))
      .attr('y', () => 50)
      .attr('width', this.rectanglePopup.width)
      .attr('height', this.rectanglePopup.height)
      .attr('stroke', 'black')
      .attr('fill', 'white')
      .attr('stroke-width', 2)

      this.graph
        .append('svg:foreignObject')
        .attr("width", 100)
        .attr("height", 100)
        .attr('x', () => (this.xScale(index) + this.xAxisOffset - this.rectanglePopup.dataXOffset) - 30)
        .attr('y', () => 50 + this.rectanglePopup.dataYOffset(1) - 20)
        .append("xhtml:div")
        .attr('class', 'popup-icon')
        .html(`<i class="${iconStyles['icon']} icon-tick"></i>`)
      this.graph
        .append('svg:foreignObject')
        .attr("width", 100)
        .attr("height", 100)
        .attr('x', () => (this.xScale(index) + this.xAxisOffset - this.rectanglePopup.dataXOffset) - 35)
        .attr('y', () => 50 + this.rectanglePopup.dataYOffset(2) - 20)
        .append("xhtml:div")
        .attr('class', 'popup-icon')
        .html(`<i class="${iconStyles['icon']} icon-calendar"></i>`)
      this.graph
        .append('svg:foreignObject')
        .attr("width", 100)
        .attr("height", 100)
        .attr('x', () => (this.xScale(index) + this.xAxisOffset - this.rectanglePopup.dataXOffset) - 30)
        .attr('y', () => 50 + this.rectanglePopup.dataYOffset(3) - 20)
        .append("xhtml:div")
        .attr('class', 'popup-icon')
        .html(`<i class="${iconStyles['icon']} icon-bg"></i>`)

      // Adds line 1
      const popupBindedGraph = this.graph
        .append('g')
        .selectAll('.rectangle-popup')
        .data([data[index]])
        .enter();
      popupBindedGraph
        .append('text')
        .attr('class', 'text-popup')
        .attr('x', () => (this.xScale(index) + this.xAxisOffset - this.rectanglePopup.dataXOffset))
        .attr('y', () => 50 + this.rectanglePopup.dataYOffset(1))
        .text(z => `${z.valueSystolic} / ${z.valueDiastolic}`)
      popupBindedGraph
        .append('text')
        .attr('class', 'text-popup')
        .attr('x', () => (this.xScale(index) + this.xAxisOffset - this.rectanglePopup.dataXOffset))
        .attr('y', () => 50 + this.rectanglePopup.dataYOffset(2))
        .text(z => z.bgChecks)

        popupBindedGraph
        .append('text')
        .attr('class', 'text-popup')
        .attr('x', () => (this.xScale(index) + this.xAxisOffset - this.rectanglePopup.dataXOffset))
        .attr('y', () => 50 + this.rectanglePopup.dataYOffset(3))
        .text(z => z.date)
  }

  removeMarker() {
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
  }

  removeAllPlot() {
    d3
      .select('svg')
      .remove();
    this.graph = null;
  }

  initializeGraph(data, type, monthNumber) {

    this.extreme = 500;
    // Precalculates everything
    this.precalculate(data, type, monthNumber);
    // Creates a svg with width and height
    this.createSvg();
    // // Draw axis
    this.drawAxis();
    // // Draw Grid lines
    this.drawGridLines();
    // // Plot lines
    this.drawGraph(data);

  }

  plot(data, type, htSettings, monthNumber) {
    const {
      hypertensionDiastolicThreshold: hyperDia,      
      hypertensionSystolicThreshold: hyperSys,
      hypotensionDiastolicThreshold: hypoDia,
      hypotensionSystolicThreshold: hypoSys,
    } = htSettings;
    
    this.hyperDia = hyperDia;
    this.hyperSys = hyperSys;
    this.hypoDia = hypoDia;
    this.hypoSys = hypoSys;
    
    this.initializeGraph(data, type, monthNumber);
  }

}

export default diabetesOverviewGraph;
