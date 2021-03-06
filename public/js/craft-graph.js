import * as d3 from 'd3';
import Timer from './timer';

class CraftGraph {
	/**
	 * @param settings.id
	 * @param settings.svg
	 * @param settings.width
	 * @param settings.discToSpikeRatio
	 * @param settings.duration
	 * @param settings.onStart
	 * @param settings.onEndStart
	 * @param settings.onEndComplete
	 */
	constructor(settings){
		this.id = settings.id;
		this.svg = settings.svg;
		this.width = settings.width;
		this.radius = this.width / 2;
		this.discRadius = this.radius * settings.discToSpikeRatio;
		this.onStart = settings.onStart || function(){};
		this.onEndStart = settings.onEndStart || function(){};
		this.onEndComplete = settings.onEndComplete || function(){};
		this.numIndices = Math.floor(settings.duration / 1000);
		this.scaleIndexToRadians = d3.scaleLinear().domain([0, this.numIndices]).range([0, Math.PI * 2]);

		const svgRectangle = this.svg.node().getBoundingClientRect();

		const arc = d3.arc()
		.innerRadius(-this.radius)
		.outerRadius(this.discRadius);

		this.draw = function(){
			path.data(this.generateTimerData())
				.attr("d", arc);
		}
		this.start = function(){
			this.timer.start();
		}
		this.stop = function(){
			this.timer.stop();
		}

		this.timer = new Timer({
			duration: settings.duration, 
			onTick : ::this.draw,
			onStart : () => {
				this.onStart();
			},
			onEnd : () => {
				this.onEndStart();
				path.each(function(d) { this._current = d; })
					.data(this.generateEndTimerData())
					.transition().duration(1030).attrTween('d', function(a){
			    		var i = d3.interpolate(this._current, a);
						this._current = i(0);
						return function(t) {
							return arc(i(t));
						};
			    	}).on('end', () => {
			    		this.onEndComplete();
			    	});
				
			}
		});
		
		this.colorScale = d3.scaleLinear().domain([0, this.numIndices - 1]).range([.8, .2]);
		this.color = (index) => {
			return d3.interpolateInferno(this.colorScale(index));
		};
		
		const g = this.svg
		.append("g")
		.attr('class', 'craft-graph')
		.attr("transform", "translate(" + svgRectangle.width / 2 + "," + svgRectangle.height / 2 + ")");

		const path = g.selectAll("path")
		.data(this.generateTimerData())
		.enter().append("path")
		.attr("fill", (d, i) => { return this.color(i); })
		.attr("d", arc)
	    .each(function(d) { this._start = d; }); // store the initial angles
	}

	generateTimerData(){
		const elapsed = this.timer.elapsed;
		const numIndices = this.numIndices;
		let numIndicesCompleted = Math.floor(elapsed / 1000);
		if (numIndicesCompleted > numIndices){
			numIndicesCompleted = numIndices;
		}
		const values = Array(numIndices).fill(0);
		for(let i = 0; i < numIndicesCompleted; i++){
			values[i] = 1000;
		}
		values[numIndicesCompleted] = elapsed % 1000;

		const result = values.map((val, index) => {
			const easedVal = d3.easeCubic(CraftGraph.scaleMillisecondsToSeconds(val));
			
			const result = {
				data : val,
				value : easedVal,
				startAngle : this.scaleIndexToRadians(index),
				endAngle : this.scaleIndexToRadians(index + easedVal),
				padAngle: 0
			}
			console.log('craft timer data', 'index', index, 'result', result );
			return result;
		});
		return result;
	}

	generateEndTimerData(){
		const elapsed = this.timer.elapsed;
		const numIndices = this.numIndices;
		const values = Array(numIndices).fill(0);
		const result = values.map((val, index) => {
			return {
				data : 0,
				value : 0,
				startAngle : 0,
				endAngle : 0,
				padAngle: 0
			}
		});
		return result;
	}
}

CraftGraph.scaleMillisecondsToSeconds = d3.scaleLinear().domain([0, 1000]).range([0, 1]);


export default CraftGraph;