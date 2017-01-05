// =============================================================================
// === jQuery animations =======================================================
// =============================================================================

var firsttime = true;
$(document).ready(function() {
	$("#menu").hide();
	$('#fullpage').fullpage({
		sectionsColor: 	['whitesmoke', 	'whitesmoke', 			'#1bbc9b', 			'white'],
		anchors: 		['intro', 		'visualization1',	'visualization2', 	'aboutus'],
		menu: '#menu',
		onLeave: function(index, nextIndex, direction){
			firsttime = false;
			if(nextIndex != 1)
				$("#menu").fadeIn();
			else
				$("#menu").fadeOut();
		},
		afterLoad: function(anchorLink, index){

			if(index == 1){
				$('#section0 .text-editor-wrap').delay(200).animate({opacity: 1}, 200, function() {
					$('#being_typed_intro').delay(200).animate({ marginTop: "0", opacity: 1 }, 200, function(){
						$('#sc_ind').fadeIn().delay(500).queue(function(next) {
  							$(this).addClass("bouncing");
  							next();
						});
					});
				});

				
			}
			else if(index == 2){
				$('#sc_ind2').fadeIn().queue(function(next) {
						$(this).addClass("bouncing");
						next();
				});
			}
			else if(index == 3){
				$('#sc_ind3').fadeIn().queue(function(next) {
						$(this).addClass("bouncing");
						next();
				});				
			}
			
		}
	});

	$.fn.fullpage.setMouseWheelScrolling(false);
    $.fn.fullpage.setAllowScrolling(false);

	$("#demosMenu").change(function(){
      window.location.href = $(this).find("option:selected").attr("id") + '.html';
    });

    $(".fa").click(function(){
    	$.fn.fullpage.moveSectionDown();
    });


// =============================================================================
// === D3.js Pie chart =========================================================
// =============================================================================

	// load data and parse it accordingly to for a dataset to use with the pie
	d3.text("data/pie.csv", function(text){
		var csvData = d3.csv.parseRows(text);
		var dataset = new Array();
		var type = ['1975','2013'];

		for (var i = 0; i < type.length; i++) {
			var data = new Array();
			var total = 0;

			for (var j = 1; j < csvData.length; j++) {
		    	total += parseFloat(csvData[j][i+1]);
		    	data.push({
			    	"cat": csvData[j][0],
			    	"val": parseFloat(csvData[j][i+1])		    		
		    	});
			}	 
			dataset.push({
				"type":type[i],
				"data": data,
				"total": total
			}) 			
		}
  
	    var donutData = dataset;

	    var donuts = new DonutCharts();
	    donuts.create(donutData);
	});

    function DonutCharts() {

        var charts = d3.select('#donut-charts');

        var chart_m,
            chart_r,
            color = function(i){
            	switch(i) {
            		case 0:
            			return "#d73027";
            			break;
            		case 1:
            			return "#fc8d59"
            		case 2:
            			return "#fee08b"
            		case 3:
            			return "#ffffbf"
            		case 4:
            			return "#d9ef8b"
            		case 5:
            			return "#91cf60"
            		case 6:
            			return "#1a9850"
            		default:
            			return "black";
            	}
            }
        var getCatNames = function(dataset) {
            var catNames = new Array();

            for (var i = 0; i < dataset[0].data.length; i++) {
                catNames.push(dataset[0].data[i].cat);
            }

            return catNames;
        }

        var createCenter = function(pie) {

            var eventObj = {
                'mouseover': function(d, i) {
                    d3.select(this)
                        .transition()
                        .attr("r", chart_r * 0.65);
                },

                'mouseout': function(d, i) {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .ease('bounce')
                        .attr("r", chart_r * 0.6);
                },
            }

            var donuts = d3.selectAll('.donut');

            // The circle displaying total data.
            donuts.append("svg:circle")
                .attr("r", chart_r * 0.6)
                .style("fill", "#E7E7E7")
                .on(eventObj);
    
            donuts.append('text')
                    .attr('class', 'center-txt type')
                    .attr('y', chart_r * -0.16)
                    .attr('text-anchor', 'middle')
                    .style('font-weight', 900)
                    .text(function(d, i) {
                        return d.type;
                    });
            donuts.append('text')
                    .attr('class', 'center-txt value')
                    .attr('text-anchor', 'middle');
            donuts.append('text')
                    .attr('class', 'center-txt percentage')
                    .attr('y', chart_r * 0.16)
                    .attr('text-anchor', 'middle')
                    .style('fill', '#A2A2A2');
        }

        var setCenterText = function(thisDonut) {
            var sum = d3.sum(thisDonut.selectAll('.clicked').data(), function(d) {
                return d.data.val;
            });

            thisDonut.select('.value')
                .text(function(d) {
                    return (sum)? sum.toFixed(1) + '%'
                                : d.total.toFixed(1) + '%'; 
                });
            thisDonut.select('.percentage')
                .text(function(d) {
                    return (sum)? (sum/d.total*100).toFixed(2) + '%'
                                : '';
                });
        }

        var resetAllCenterText = function() {
            charts.selectAll('.value')
                .text(function(d) {
                    return d.total.toFixed(1) + '%';
                });
            charts.selectAll('.percentage')
                .text('');
        }

        var pathAnim = function(path, dir) {
            switch(dir) {
                case 0:
                    path.transition()
                        .duration(500)
                        .ease('bounce')
                        .attr('d', d3.svg.arc()
                            .innerRadius(chart_r * 0.7)
                            .outerRadius(chart_r)
                        );
                    break;

                case 1:
                    path.transition()
                        .attr('d', d3.svg.arc()
                            .innerRadius(chart_r * 0.7)
                            .outerRadius(chart_r * 1.08)
                        );
                    break;
            }
        }

        var updateDonut = function() {

            var eventObj = {
            	// on mouseover we wanna make bigger both pie parts, so its 
            	// easier to compare
                'mouseover': function(d, i, j) {

	                var thisPath = d3.select(this);
                    var correctCat = thisPath[0][0]["__data__"].data.cat;

                    var thisDonut = charts.select('.type0');
                    thisDonut.selectAll('path')
                    	.each(function(d, i){
                    		if (correctCat === d.data.cat) {
                    			pathAnim(d3.select(this), 1);
			                    thisDonut.select('.value').text(function(donut_d) {
			                        return d.data.val.toFixed(1) + '%';
			                    });
			                    thisDonut.select('.percentage').text(function(donut_d) {
			                    	return d.data.cat;
			                    });
                    		}
                    	});

                    var thatDonut = charts.select('.type1');
                    thatDonut.selectAll('path')
                    	.each(function(e, i){

                    		if (correctCat === e.data.cat) {
                    			pathAnim(d3.select(this), 1);
    		                    thatDonut.select('.value').text(function(donut_d) {
			                        return e.data.val.toFixed(1) + '%';
			                    });

			                    thatDonut.select('.percentage').text(function(donut_d) {
			                    	return e.data.cat;
			                    });
                    		}
                    	});

                },
                
                'mouseout': function(d, i, j) {
                    var thisPath = d3.select(this);
                    var correctCat = thisPath[0][0]["__data__"].data.cat;
                    var thisDonut = charts.select('.type0');
                    thisDonut.selectAll('path')
                    	.each(function(d, i){
                    		if (correctCat === d.data.cat) {
                    			pathAnim(d3.select(this), 0);
                    		}
                    	});                   
                    setCenterText(thisDonut);

                    var thatDonut = charts.select('.type1');
                    thatDonut.selectAll('path')
                    	.each(function(d, i){
                    		if (correctCat === d.data.cat) {
                    			pathAnim(d3.select(this), 0);
                    		}
                    	});
                    setCenterText(thatDonut);
                },
            };

            var pie = d3.layout.pie()
                            .sort(null)
                            .value(function(d) {
                                return d.val;
                            });

            var arc = d3.svg.arc()
                            .innerRadius(chart_r * 0.7)
                            .outerRadius(function() {
                                return (d3.select(this).classed('clicked'))? chart_r * 1.08
                                                                           : chart_r;
                            });

            // Start joining data with paths
            var paths = charts.selectAll('.donut')
                            .selectAll('path')
                            .data(function(d, i) {
                                return pie(d.data);
                            });

            paths
                .transition()
                .duration(1000)
                .attr('d', arc);

            paths.enter()
                .append('svg:path')
                    .attr('d', arc)
                    .style('fill', function(d, i) {
                        return color(i);
                    })
                    .style('stroke', '#FFFFFF')
                    .on(eventObj)

            paths.exit().remove();

            resetAllCenterText();
        }

        this.create = function(dataset) {
            var $charts = $('#donut-charts');
            chart_m = $charts.innerWidth() / dataset.length / 2 * 0.08;
            chart_r = $charts.innerWidth() / dataset.length / 2 * 0.70;

            charts.append('svg')
                .attr('class', 'legend')
                .attr('width', '100%')
                .attr('height', 50)
                .attr('transform', 'translate(0, -100)');

            var donut = charts.selectAll('.donut')
                            .data(dataset)
                        .enter().append('svg:svg')
                            .attr('width', (chart_r + chart_m) * 2)
                            .attr('height', (chart_r + chart_m) * 2)
                        .append('svg:g')
                            .attr('class', function(d, i) {
                                return 'donut type' + i;
                            })
                            .attr('transform', 'translate(' + (chart_r+chart_m) + ',' + (chart_r+chart_m) + ')');

            createCenter();

            updateDonut();
        }
    }

// =============================================================================
// === D3.js part Man's body ===================================================
// =============================================================================

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


});


