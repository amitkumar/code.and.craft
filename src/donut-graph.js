import * as d3 from 'd3';
import Timer from './timer';

export default class {
	constructor(id, svg, duration, width, thickness){
		this.id = id;
		this.svg = svg;
		this.width = width;
		this.radius = this.width / 2;
		this.thickness = thickness;

		// Store the displayed angles in _current.
		// Then, interpolate from _current to the new angles.
		// During the transition, _current is updated in-place by d3.interpolate.
		function arcTween(a) {
			var i = d3.interpolate(this._current, a);
			this._current = i(0);
			return function(t) {
				return arc(i(t));
			};
		}

		this.draw = function(){
			console.log('draw');
			g.datum(this.timerData);
			path.data(pie); // compute the new angles
		    path.transition().duration(1000).attrTween("d", arcTween); // redraw the arcs
		}
		this.start = function(){
			this.timer.start();
		}


		this.timer = new Timer(duration, 1001, ::this.draw, ::this.draw);
		
		const data = this.timerData;
		const colorScale = d3.scaleLinear().domain([0, data.length - 1]).range([.8, .2]);
		const color = function(index){
			return d3.interpolateInferno(colorScale(index));
		};
		
		const pie = d3.pie().sort(null);

		const arc = d3.arc()
		.innerRadius(this.radius - thickness)
		.outerRadius(this.radius);

		const g = this.svg
		.append("g")
		.attr("transform", "translate(" + this.width / 2 + "," + this.width / 2 + ")");

		let path = g.datum(data).selectAll("path")
		.data(pie)
		.enter().append("path")
		.attr("fill", function(d, i) { return color(i); })
		.attr("d", arc)
	    .each(function(d) { this._current = d; }); // store the initial angles
	}

	get elapsed(){
		if (!this.running){
			return 0;
		}
		return Date.now() - this.startedAt;
	}

	get timerData(){
		return this.constructor.generateTimerData(this.timer.duration, this.timer.elapsed);
	}

	/**
	 * For a duration of n seconds, generates an array with n+1 numbers initialized to 0.
	 * Number of elapsed milliseconds will be reflected with appropriate number of array indices 
	 * set to 1000, with last item in array holding remaining duration.
	 */
	static generateTimerData(duration, elapsed){
		console.log('duration, elapsed', duration, elapsed);
		const numIndices = Math.floor(duration / 1000);
		const numIndicesElapsed = Math.ceil(elapsed / 1000);
		let result = Array(numIndices + 1).fill(0);
		for(let i = 0; i < numIndicesElapsed; i++){
			result[i] = 1000;
		}
		result[result.length - 1] = (numIndices - numIndicesElapsed) * 1000;
		console.log('numIndices', numIndices, 'numIndicesElapsed', numIndicesElapsed);
		console.log(result);
		return result;
	}
}