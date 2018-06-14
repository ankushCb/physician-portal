import React, { Component } from 'react';
import * as d3 from 'd3';
import moment from 'moment';
import PropTypes from 'prop-types';

import './style.scss';

// returns the formatted data for Display time
const getCentralDisplayFormat = (min, a, b) => {
  const time = b.isAfter(a) ? min : (24 * 60 - min) % (24 * 60);
  const hours = parseInt(Math.abs(time / 60)) < 10 ? `0${parseInt(Math.abs(time / 60))}` : parseInt(Math.abs(time / 60));
  const minutes = parseInt(Math.abs(time) % 60) < 10 ? `0${parseInt(Math.abs(time) % 60)}` : parseInt(Math.abs(time) % 60);
  return `<span class="timedisplay-number">${hours}</span>HR <span class="timedisplay-number">${minutes}</span>MIN`;
};

// Formats timing for start and stop timing
const formatTiming = (time) => {
  const hours = Math.floor(time / 15);
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const minutes = parseInt(60 * ((time / 15) - Math.floor(time / 15)));
  const roundOffMinutes = Math.floor(minutes / 15) * 15;
  const formattedMinutes = roundOffMinutes < 10 ? `0${roundOffMinutes}` : roundOffMinutes;
  return `${formattedHours}:${formattedMinutes}`;
};

// Get respective hours from coordinate position
const getHours = (x, y, alpha) => {
  const swept = 180 * alpha / Math.PI;
  if (x >= 0 && y < 0) {
    return formatTiming((90 - swept));
  } else if (x >= 0 && y >= 0) {
    return formatTiming((90 + swept));
  } else if (x <= 0 && y >= 0) {
    return formatTiming((90 + swept));
  } else if (x <= 0 && y < 0) {
    return formatTiming((270 + (180 - swept)));
  }
};

// Given a time returns the alpha with respect to origin.
const getAlpha = (time) => {
  const timeArray = time.split(':');
  return (parseInt(timeArray[0]) * 60 + parseInt(timeArray[1])) * (360) / (24 * 60);
};

class ClockEdit {

  constructor(domNode) {
    this.domNode = domNode;
  }

  plotDial() {
    
    d3.selectAll('.hourDisplay')
    .data(d3.range(0, 24))
    .enter()
    .append('text')
    .attr('class', 'hour-indicator')
    .attr('x', (d, i) => {
      const alteredClockRadius = ((i + 6) % 24)  <= 12 ? clockRadius - 8 : clockRadius + 9;
      return i % 2 == 0 ? (alteredClockRadius) * Math.cos((360 * (i)) / (24 * 57.2958)) : null;
    })
    .attr('y', (d, i) => {
      return i % 2 == 0 ? (clockRadius) * Math.sin((360 * (i)) / (24 * 57.2958)) : null;
    })
    .text((d, i) => i % 2 == 0 ? formatTime((i + 6) % 24) : '');

  }

  removePlot() {
    d3.select('svg').remove();
  }
  // Calculates the difference and writes it in the center of the clock
  calculateDifference() {
    // Removes any existing writing. So it writes for handle change
    d3.select('.time-display').remove();
    // rewritting time
    d3.select('svg')
      .append('g')
      .attr('class', 'time-display')
      .attr('transform', 'translate(160, 185)')
      .append('svg:foreignObject')
      .attr('width', 120)
      .attr('height', 30)
      .append('xhtml:div')
      .attr('class', 'inner-display')
      .html((x) => {
        const a = moment(this.startData.hours, 'HH:mm');
        const b = moment(this.stopData.hours, 'HH:mm');
        return `<span>${getCentralDisplayFormat(a.diff(b, 'minutes'), a, b)}</span>`;
      });
  }

  plot(config, defaultValue) {
    const {
      canvasWidth,
      canvasHeight,
      clockRadius,
      offsetCenterX,
      offsetCenterY,
    } = config;
    // Digits display plots
    const formatTime = (time) => {
      const result = (`${time%12 ? time%12 : 12} ${time/12 >= 1 ? 'PM' : 'AM'}`);
      // console.log('result ', time, result);
      return result;
    }

    

    // extract start and stop angle for circles with respect to current axis
    const startAlpha = getAlpha(defaultValue.startTime || '00:00') - 90;
    const stopAlpha = getAlpha(defaultValue.stopTime || '12:00') - 90;
    const radianConverter = 1 / (180 / Math.PI);


    const handleStart = [{
      x: clockRadius * Math.cos(startAlpha * radianConverter),
      y: clockRadius * Math.sin(startAlpha * radianConverter),
    }];
    const handleStop = [{
      x: clockRadius * Math.cos(stopAlpha * radianConverter),
      y: clockRadius * Math.sin(stopAlpha * radianConverter),
    }];

    this.startData = {
      x: handleStart[0].x,
      y: handleStart[0].y < 0 ? (handleStart[0].y) : (handleStart[0].y),
      alpha: startAlpha,
      hours: defaultValue.startTime,
    };

    this.stopData = {
      x: handleStop[0].x,
      y: handleStop[0].y < 0 ? (handleStop[0].y) : (handleStop[0].y),
      alpha: stopAlpha,
      hours: defaultValue.stopTime,
    };

    const dialLine = d3.line()
    .x((d) => (d.x))
    .y((d) => (d.y));
    // Default plot starts here
    // plot the SVG
    const svg = d3.select(this.domNode)
      .append('svg')
      .attr('width', canvasWidth)
      .attr('height', canvasHeight)
      .append('g')
      .attr('transform', `translate(${offsetCenterX},${offsetCenterY})`);
    const boxOne = [{ x: 50, y: 50 }, { x: 140, y: 50 }, { x: 140, y: 80 }, { x: 50, y: 80 }, { x: 50, y: 50 }];
    d3
    .select('svg')
    .append('g')
    .attr('fill', '#ffffff')
    .attr('transform', `translate(${-10},${3})`)
    .append('path')
    .datum(boxOne)
    .style('stroke', '#3a6ca9')
    .style('stroke-width', 2)
    .attr('d', dialLine);
    d3
    .select('svg')
    .append('g')
    .attr('fill', '#ffffff')
    .attr('transform', `translate(${220},${3})`)
    .append('path')
    .datum(boxOne)
    .style('stroke', '#3a6ca9')
    .style('stroke-width', 2)
    .attr('d', dialLine);
    // Start time display positioning
    d3.select('svg')
      .append('g')
      .attr('class', 'startTime')
      .attr('transform', `translate(${50},${75})`);
    // Stop time positioning
    d3.select('svg')
      .append('g')
      .attr('class', 'stopTime')
      .attr('transform', `translate(${280},${75})`);
    // Arc function to display positioning
    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(100);
    d3.select('g.startTime')
      .append('text')
      .text(() => {
        return moment(this.startData.hours, 'HH:mm').format('h:mm A');
      });
    d3.select('g.stopTime')
      .append('text')
      .text(() => {
        return moment(this.stopData.hours, 'HH:mm').format('h:mm A');
      });

    // Calculate initial angle
    let alphaX = getAlpha(this.startData.hours);
    const alphaY = getAlpha(this.stopData.hours);

    // Invert to make major minor difference
    if (alphaX > alphaY) {
      alphaX -= 360;
    }

    
    // Plot the selected arc initially
    d3
      .select('svg')
      .append('g')
      .attr('class', 'parent-arc')
      .append('g')
      .attr('transform', `translate(${offsetCenterX},${offsetCenterY})`)
      .attr('class', 'arc')
      .append('path')
      .datum({
        startAngle: (alphaX) / (180 / Math.PI),
        endAngle: (alphaY) / (180 / Math.PI),
      })
      .style('fill', '#dee3e9')
      .attr('fill-opacity', 0.7)
      .attr('d', arc);

      const getLine = (data) => {
        return ([
          {
            x: 0,
            y: 0,
          },
          {
            x: data.x,
            y: data.y,
          },
        ]);
      } 
      // Dual Line
      const lines = [getLine(this.startData), getLine(this.stopData)];
      let x = [0, 0]
      for (var i = 0; i <= 1; i++) {
        d3
        .select('svg')
        .append('g')
        .attr('class', `start-line-arc-${i}`)
        .append('g')
        .attr('transform', `translate(${offsetCenterX},${offsetCenterY})`)
        .attr('class', 'start-arc')
        .append('path')
        .datum(lines[i])
        .style('stroke', '#3a6ca9')
        .style('stroke-width', 2)
        .attr('d', dialLine);
      }

    // Plotting tow simple line plots

    // Plot the hours calculation
    // this.calculateDifference();

    // Container to actually hold certain components
    const container = svg.append('g');
    const circumference = container.append('circle')
    .attr('r', clockRadius)
    .attr('class', 'circumference');
    container
      .append('g')
      .attr('class', 'dial-numbers')
      .attr('transform', 'translate(-5, 5)')
      .selectAll('.hourDisplay')
      .data(d3.range(0, 24))
      .enter()
      .append('text')
      .attr('class', 'hour-indicator')
      .attr('x', (d, i) => {
        const alteredClockRadius = ((i + 6) % 24)  <= 12 ? clockRadius - 8 : clockRadius + 9;
        return i % 2 == 0 ? (alteredClockRadius) * Math.cos((360 * (i)) / (24 * 57.2958)) : null;
      })
      .attr('y', (d, i) => {
        return i % 2 == 0 ? (clockRadius) * Math.sin((360 * (i)) / (24 * 57.2958)) : null;
      })
      .text((d, i) => i % 2 == 0 ? formatTime((i + 6) % 24) : '');


      // To style the circumference
    container.append('circle')
      .attr('r', 3)
      .attr('class', 'inner-mark');
    const hourScale = d3.scaleLinear().domain([0, 24]).range([0, 360]);

    const hoursTickStart = clockRadius;
    const secondTickLength = -10;

    // scale to fit the ticks
    const hoursScale = d3.scaleLinear()
	    .domain([0, 24])
      .range([0, 360]);
    
    // Drag started functionality
    const _this = this;
    const dragStarted = function (d) {
      d3.event.sourceEvent.stopPropagation();
      d3
        .select(this)
        .classed('dragging', true);
      const parentNode = d3
        .select('g > circle.dragging')
        .node()
        .parentNode;
      // Find the active selected and set it.
      if (d3.select(parentNode).classed('start-holder')) {
        _this.activeSelected = 'start';
      } else {
        _this.activeSelected = 'stop';
      }
    };

    // Dragging functionality callback
    const dragged = function (d) {
      // distance from origin
      const dFromOrigin = Math.sqrt(Math.pow(d3.event.x, 2) + Math.pow(d3.event.y, 2));
      // Angle based on origin
      const alpha = Math.acos(d3.event.x / dFromOrigin);
      const deltaXOffset = 4 * (((alpha * 180 / Math.PI) +90) / 180) * (d3.event.x > 0 ? 1 : -1);
      // console.log('delta', deltaXOffset, alpha*180/Math.PI);
      // Change the handle position based on the drag position
      d3.select(this)
        .attr('cx', d.x = (94 * Math.cos(alpha)) + deltaXOffset)
        .attr('cy', d.y = d3.event.y < 0 ? -99 * Math.sin(alpha) : 99 * Math.sin(alpha));

      // If it is start change the start data and vice versa for stop
      if (_this.activeSelected === 'start') {
        _this.startData = {
          x: 100 * Math.cos(alpha),
          y: d3.event.y < 0 ? -100 * Math.sin(alpha) : 100 * Math.sin(alpha),
          alpha,
          hours: getHours(100 * Math.cos(alpha), d3.event.y < 0 ? -100 * Math.sin(alpha) : 100 * Math.sin(alpha), alpha),
        };
        // Remove the existing time
        d3.select('g.startTime > text').remove();
        // Rewrite the time
        d3.select('g.startTime')
          .append('text')
          .text(() => {
            return moment(_this.startData.hours, 'HH:mm').format('hh:mm A');
          });

        // Recalculate apha for handle
        let alphaX = getAlpha(_this.startData.hours);
        const alphaY = getAlpha(_this.stopData.hours);
        if (alphaX > alphaY) {
          alphaX -= 360;
        }

        // plot arc - repeated in stop data too
        d3.select('.arc').remove();
        d3
          .select('.parent-arc')
          .append('g')
          .attr('transform', `translate(${offsetCenterX},${offsetCenterY})`)
          .attr('class', 'arc')
          .style('z-index', -1)
          .append('path')
          .datum({
            startAngle: (alphaX) / (180 / Math.PI),
            endAngle: (alphaY) / (180 / Math.PI),
          })
          .style('fill', '#dee3e9')
          .attr('fill-opacity', 0.7)
          .attr('d', arc);
        d3
          .selectAll('g.start-line-arc-0 > .start-arc')
          .remove();

        d3
        .select('g.start-line-arc-0')
        .append('g')
        .attr('transform', `translate(${offsetCenterX},${offsetCenterY})`)
        .attr('class', 'start-arc')
        .append('path')
        .datum(getLine(_this.startData))
        .style('stroke', '#3a6ca9')
        .style('stroke-width', 2)
        .attr('d', dialLine);
        // _this.calculateDifference();
      } else {
        // calculate stop data
        _this.stopData = {
          x: 100 * Math.cos(alpha),
          y: d3.event.y < 0 ? -100 * Math.sin(alpha) : 100 * Math.sin(alpha),
          alpha,
          hours: getHours(100 * Math.cos(alpha), d3.event.y < 0 ? -100 * Math.sin(alpha) : 100 * Math.sin(alpha), alpha),
        };
        // Remove any existing time
        d3.select('g.stopTime > text').remove();
        // Rewrite current time
        d3.select('g.stopTime')
          .append('text')
          .text(() => {
            return moment(_this.stopData.hours, 'HH:mm').format('hh:mm A');
          });

        // Recalculate alphaX and alphaY
        let alphaX = getAlpha(_this.startData.hours);
        const alphaY = getAlpha(_this.stopData.hours);
        if (alphaX > alphaY) {
          alphaX -= 360;
        }
        d3.select('.arc').remove();
        d3
          .select('.parent-arc')
          .append('g')
          .attr('transform', `translate(${offsetCenterX},${offsetCenterY})`)
          .attr('class', 'arc')
          .style('z-index', -1)
          .append('path')
          .datum({
            startAngle: (alphaX) / (180 / Math.PI),
            endAngle: (alphaY) / (180 / Math.PI),
          })
          .style('fill', '#dee3e9')
          .attr('fill-opacity', 0.7)
          .attr('d', arc);
        d3
          .selectAll('g.start-line-arc-1 > .start-arc')
          .remove();

        d3
        .select('g.start-line-arc-1')
        .append('g')
        .attr('transform', `translate(${offsetCenterX},${offsetCenterY})`)
        .attr('class', 'start-arc')
        .append('path')
        .datum(getLine(_this.stopData))
        .style('stroke', '#3a6ca9')
        .style('stroke-width', 2)
        .attr('d', dialLine);
        // _this.calculateDifference();
      }
    };

    // Remove dragging class
    const dragEnded = function (d) {
      d3.select(this)
        .classed('dragging', false);
    };

    const drag = d3.drag()
      .on('start', dragStarted)
      .on('drag', dragged)
      .on('end', dragEnded);

    const startHolder = d3
      .select('svg').append('g')
      .attr('transform', `translate(${offsetCenterX},${offsetCenterY})`)
      .attr('class', 'start-holder');
    const stopHolder = d3
      .select('svg').append('g')
      .attr('transform', `translate(${offsetCenterX},${offsetCenterY})`)
      .attr('class', 'stop-holder');

    startHolder    
      .selectAll('circle')
      .data(handleStart)
      .enter().append('circle')
      .attr('r', 20)
      .attr('cx', (d) => { return d.x < 0 ? d.x + 2: d.x - 2; })
      .attr('cy', (d) => { return d.y < 0 ? d.y + 2: d.y - 2; })
      .call(drag);

    stopHolder
      .selectAll('circle')
      .data(handleStop)
      .enter().append('circle')
      .attr('r', 20)
      .attr('cx', (d) => { return d.x < 0 ? d.x + 2 : d.x - 2; })
      .attr('cy', (d) => { return d.y < 0 ? d.y + 2 : d.y - 2 ; })
      .call(drag);

  }

  getTime() {
    return {
      startTime: moment(this.startData.hours, 'HH:mm').format('HH:mm:ss'),
      stopTime: moment(this.stopData.hours, 'HH:mm').format('HH:mm:ss'),
    };
  }
}

class TimeRangeSlider extends Component {
  constructor({ startTime, endTime }) {
    super();
    this.state = {
      startTime,
      endTime,
    };
  }

  componentDidMount() {
    this.plotClock();
  }

  componentWillReceiveProps({ startTime, endTime }) {
    this.setState({ startTime, endTime });
  }

  componentDidUpdate() {
    this.plotClock();
  }

  getTime() {
    return this.clockEditor.getTime();
  }

  plotClock() {
    // removing any existing plot
    if (this.clockEditor) {
      this.clockEditor.removePlot();
    }

    this.clockEditor = new ClockEdit(this.refs.clockEditor);
    const {
      startTime,
      endTime,
    } = this.state;
    const options = {
      canvasWidth: 400,
      canvasHeight: 360,
      clockRadius: 100,
      offsetCenterX: 200,
      offsetCenterY: 200,
    };

    const defaultValue = {
      startTime: moment(startTime, 'HH:mm:ss').format('HH:mm'),
      stopTime: moment(endTime, 'HH:mm:ss').format('HH:mm'),
    };
    this.clockEditor.plot(options, defaultValue);
  }

  render() {
    return <div ref="clockEditor" />;
  }
}

TimeRangeSlider.propTypes = {
  startTime: PropTypes.string,
  endTime: PropTypes.string,
};

TimeRangeSlider.defaultProps = {
  startTime: null,
  endTime: null,
};

export default TimeRangeSlider;
