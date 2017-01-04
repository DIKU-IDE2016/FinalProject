console.log("YOLOS")
var manBody = d3.select("#manbody");

manBody.selectAll('#svg_4')
	.on('mouseover', function(d, i){
			console.log(this);
			d3.select(this)
				.style("opacity", 0.5);
        })
        .on('mouseout', function(d){
        	d3.select(this)
				.style("opacity", 1);
        });

