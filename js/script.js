// =============================================================================
// === jQuery animations =======================================================
// =============================================================================

var firsttime = true;
$(document).ready(function() {
	$("#menu").hide();
	$('#fullpage').fullpage({
        loopHorizontal: false,
		sectionsColor: 	['whitesmoke', 'whitesmoke', 'whitesmoke', 'whitesmoke', '#FF847C'],
		anchors: 		['intro', 'visualization1',	'visualization2', 'Estimatesfor2017', 	'aboutus'],
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
                $("#hover").delay(300).fadeIn(500);
                $("#donut_chart_desc").hover(function(){
                    $("#hover").fadeOut(100);
                });
			}
			else if(index == 3){		
			}
            else if(index == 4){          
            }
			
		}
	});

	$.fn.fullpage.setMouseWheelScrolling(true);
    $.fn.fullpage.setAllowScrolling(true);

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
                    .style('font-size', 'x-large')
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
            chart_m = $charts.innerWidth() / dataset.length / 2 * 0.28;
            chart_r = $charts.innerWidth() / dataset.length / 2 * 0.9;

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

            $("#donut-charts").css("width", "100%");
        }
    }

// =============================================================================
// === D3.js part Man's body ===================================================
// =============================================================================
   
    // on load we call drawBody with Female Incidence rates
    drawBody("data/female_incidence.csv", false);
    function drawBody(csv, isMale) {
        // clean canvas of everything
        d3.selectAll("#visulaizationLines g").remove();
        d3.select("#human").selectAll('g g g path')
            .classed("clickedbody",true);

        d3.csv(csv, function(error,dataset) {
            
            if (error){
                console.log(error);
            } else {
                var combined = [],
                    colorectum = [],
                    leukemia = [],
                    liver = [],
                    lung = [],
                    prostate = [],
                    breast = [],
                    ovary = [],
                    uterus = [];

                for (var i = 0; i < dataset.length; i++) {

                    year = parseInt(dataset[i]["Year"]);
                    combined.push({"year":year, "value": parseFloat(dataset[i]["Combined"])});
                    colorectum.push({"year":year, "value": parseFloat(dataset[i]["Colorectum"])});
                    leukemia.push({"year":year, "value": parseFloat(dataset[i]["Leukemia"])});
                    liver.push({"year":year, "value": parseFloat(dataset[i]["Liver and intrahepatic bile duct"])});
                    lung.push({"year":year, "value": parseFloat(dataset[i]["Lung and bronchus"])});
                    breast.push({"year":year, "value": parseFloat(dataset[i]["Breast"])});
                    ovary.push({"year":year, "value": parseFloat(dataset[i]["Ovary"])});
                    uterus.push({"year":year, "value": parseFloat(dataset[i]["Uterus"])});
                    prostate.push({"year":year, "value": parseFloat(dataset[i]["Prostate"])});

                };

                // Define the div for the tooltip
                var div = d3.select("body").append("div")   
                    .attr("class", "tooltip")               
                    .style("opacity", 0);

                var body = d3.select("#human");

                body.selectAll('g g g path')
                    .on('click', function(){
                        var label = d3.select(this).attr("label");
                        var isClicked = !d3.select(this).classed("clickedbody");
                        d3.select(this)
                            .classed("clickedbody",isClicked);
                        if(isClicked){
                            for(var attr in clicked){
                                clicked[attr] = false;
                            }
                            clicked["Combined"] = true;
                        } else{
                            for(var attr in clicked){
                                clicked[attr] = false;
                            }
                        }
                            body.selectAll('g ellipse').
                            each(function(){
                                d3.select(this).classed("clicked",false);
                            })
                        redrawLines(clicked);
                    });

                body.selectAll('g ellipse')
                    .attr("class", "bodypoints")
                    .on('mouseover', function(d, i){ // ADD TOOLTIPS HERE
                            div.transition()        
                                .duration(200)      
                                .style("opacity", 1);      

                            div.html(d3.select(this).attr("label"))  
                                .style("left", (d3.event.pageX) + "px")     
                                .style("top", (d3.event.pageY - 28) + "px"); 
                            // d3.select(this)
                            //     .classed("hovered", true);
                        })
                        .on('mouseout', function(d){
                            div.transition()        
                                .duration(500)      
                                .style("opacity", 0); 
                            // d3.select(this)
                            //     .classed("hovered", false);
                        })
                        .on('click', function(){
                            if(clicked["Combined"]) {
                                body.selectAll('g g g path')
                                    .classed("clickedbody",false);
                                clicked["Combined"] = false;
                            }
                            var label = d3.select(this).attr("label");
                            var isClicked = !d3.select(this).classed("clicked");
                            d3.select(this)
                                .classed("clicked",isClicked);
                                clicked[label] = isClicked;
                                // console.log(clicked)
                            redrawLines(clicked);
                        });

                    // datapoints differ from male and female
                    // Males do not have breast or uterus cancers, so we remove 
                    // those body points
                    if(isMale) {

                        var clicked = {
                            "Combined": true,
                            "Colorectum": false,
                            "Leukemia": false,
                            "Liver and intrahepatic bile duct": false,
                            "Lung and bronchus": false,
                            "Prostate": false
                        }
                        body.selectAll('#breast')
                            .attr("visibility", "hidden");
                        body.selectAll('#uterus')
                            .attr("visibility" , "hidden");
                        body.selectAll('#ovary')
                            .attr("visibility" , "hidden");  
                        body.selectAll('#prostate')
                            .attr("visibility" , "visible");   
                    } else {

                        var clicked = {
                            "Combined": true,
                            "Breast": false,
                            "Colorectum": false,
                            "Leukemia": false,
                            "Liver and intrahepatic bile duct": false,
                            "Lung and bronchus": false,
                            "Ovary": false,
                            "Uterus": false
                        }      
                        body.selectAll('#breast')
                            .attr("visibility", "visible");
                        body.selectAll('#uterus')
                            .attr("visibility" , "visible");     
                        body.selectAll('#ovary')
                            .attr("visibility" , "visible");  
                        body.selectAll('#prostate')
                            .attr("visibility" , "hidden");    
                    }
// =============================================================================
// === D3.js part Line plots ===================================================
// =============================================================================

                    var vis = d3.select("#visulaizationLines"),
                    WIDTH = 600,
                    HEIGHT = 400,
                    MARGINS = {
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 50
                    },
                    // here we define the ranges and domains of x and y scales
                    xScale = d3.scale.linear()
                                .range([MARGINS.left, WIDTH - MARGINS.right])
                                .domain([1975, 2013]);

                    yScale = d3.scale.linear()
                                .range([HEIGHT - MARGINS.top, MARGINS.bottom])
                                .domain([
                                    0,
                                    Math.max.apply(null, combined.map(function(a){return a.value;}))
                                ]);

                    xAxis = d3.svg.axis()
                        .scale(xScale)
                        .tickFormat(d3.format("d")),
                      
                    yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient("left");

                    // Append both axis
                    vis.append("svg:g")
                        .attr("class","axis")
                        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
                        .call(xAxis);

                    var yAxisGroup = vis.append("svg:g")
                        .attr("class","axis")
                        .attr("transform", "translate(" + (MARGINS.left) + ",0)");

                        yAxisGroup
                        .transition()
                        .duration(1000)
                        .call(yAxis);  // Update Y-Axis

                    // Append axis labels
                    vis.append("text")
                        .attr("class", "x label")
                        .attr("text-anchor", "end")
                        .attr("x", WIDTH-20)
                        .attr("y", HEIGHT-25)
                        .text("Year");

                    vis.append("text")
                        .attr("class", "y label")
                        .attr("text-anchor", "end")
                        .attr("y", 65)
                        .attr("x", -20)
                        .attr("transform", "rotate(-90)")
                        .text("Value");

                    // generate the actual line
                    var lineGen = d3.svg.line()
                      .x(function(d) {
                        return xScale(d.year);
                      })
                      .y(function(d) {
                        return yScale(d.value);
                      });

                    redrawLines(clicked);
                    function redrawLines(clicked){
                        var duration = 1000;
                        // REMOVING ALL PLOT LINES (this should be expanded to remove only those who are not clicked)
                        vis.selectAll(".plotline").remove();

                        // RESCALING AXIS
                        var concatenatedArray = [];
                        for(var attr in clicked){
                            if (clicked[attr]){
                                switch(attr){
                                    case "Combined":
                                        concatenatedArray = concatenatedArray.concat(combined);
                                        break;
                                    case "Breast":
                                        concatenatedArray = concatenatedArray.concat(breast);
                                        break;                              
                                    case "Colorectum":
                                        concatenatedArray = concatenatedArray.concat(colorectum);
                                        break; 
                                    case "Leukemia":
                                        concatenatedArray = concatenatedArray.concat(leukemia);
                                        break; 
                                    case "Liver and intrahepatic bile duct":
                                        concatenatedArray = concatenatedArray.concat(liver);
                                        break;
                                    case "Lung and bronchus":
                                        concatenatedArray = concatenatedArray.concat(lung);
                                        break;
                                    case "Prostate":
                                        concatenatedArray = concatenatedArray.concat(prostate);
                                        break;
                                    case "Ovary":
                                        concatenatedArray = concatenatedArray.concat(ovary);
                                        break;
                                    case "Uterus":
                                        concatenatedArray = concatenatedArray.concat(uterus);
                                        break;
                                }
                            }
                        }
                        yScale.domain([0, Math.max.apply(null, concatenatedArray.map(function(a){return a.value;}))])
                        yAxisGroup
                        .transition()
                        .duration(duration)
                        .call(yAxis);  // Update Y-Axis

                        // APPENDING LINES
                        for(var attr in clicked){
                            if (clicked[attr]){
                                switch(attr){
                                    case "Combined":
                                        var path = vis.append('svg:path')
                                          .classed('plotline', true)
                                          .attr('d', lineGen(combined))
                                          .attr('stroke', 'green')
                                          .attr('stroke-width', 2)
                                          .attr('fill', 'none');
                                        var totalLength = path.node().getTotalLength();

                                        path
                                          .attr("stroke-dasharray", totalLength + " " + totalLength)
                                          .attr("stroke-dashoffset", totalLength)
                                          .transition()
                                          .duration(duration)
                                          .ease("linear")
                                          .attr("stroke-dashoffset", 0);
                                        break;
                                    case "Breast":
                                        var path = vis.append('svg:path')
                                          .classed('plotline', true)
                                          .attr('d', lineGen(breast))
                                          .attr('stroke', 'green')
                                          .attr('stroke-width', 2)
                                          .attr('fill', 'none');
                                        var totalLength = path.node().getTotalLength();

                                        path
                                          .attr("stroke-dasharray", totalLength + " " + totalLength)
                                          .attr("stroke-dashoffset", totalLength)
                                          .transition()
                                          .duration(duration)
                                          .ease("linear")
                                          .attr("stroke-dashoffset", 0);
                                        break;                              
                                    case "Colorectum":
                                        var path = vis.append('svg:path')
                                          .classed('plotline', true)
                                          .attr('d', lineGen(colorectum))
                                          .attr('stroke', 'green')
                                          .attr('stroke-width', 2)
                                          .attr('fill', 'none');
                                        var totalLength = path.node().getTotalLength();

                                        path
                                          .attr("stroke-dasharray", totalLength + " " + totalLength)
                                          .attr("stroke-dashoffset", totalLength)
                                          .transition()
                                          .duration(duration)
                                          .ease("linear")
                                          .attr("stroke-dashoffset", 0);
                                        break; 
                                    case "Leukemia":
                                        var path = vis.append('svg:path')
                                          .classed('plotline', true)
                                          .attr('d', lineGen(leukemia))
                                          .attr('stroke', 'green')
                                          .attr('stroke-width', 2)
                                          .attr('fill', 'none');
                                        var totalLength = path.node().getTotalLength();

                                        path
                                          .attr("stroke-dasharray", totalLength + " " + totalLength)
                                          .attr("stroke-dashoffset", totalLength)
                                          .transition()
                                          .duration(duration)
                                          .ease("linear")
                                          .attr("stroke-dashoffset", 0);
                                        break; 
                                    case "Liver and intrahepatic bile duct":
                                        var path = vis.append('svg:path')
                                          .classed('plotline', true)
                                          .attr('d', lineGen(liver))
                                          .attr('stroke', 'green')
                                          .attr('stroke-width', 2)
                                          .attr('fill', 'none');
                                        var totalLength = path.node().getTotalLength();

                                        path
                                          .attr("stroke-dasharray", totalLength + " " + totalLength)
                                          .attr("stroke-dashoffset", totalLength)
                                          .transition()
                                          .duration(duration)
                                          .ease("linear")
                                          .attr("stroke-dashoffset", 0);
                                        break;
                                    case "Lung and bronchus":
                                        var path = vis.append('svg:path')
                                          .classed('plotline', true)
                                          .attr('d', lineGen(lung))
                                          .attr('stroke', 'green')
                                          .attr('stroke-width', 2)
                                          .attr('fill', 'none');
                                        var totalLength = path.node().getTotalLength();

                                        path
                                          .attr("stroke-dasharray", totalLength + " " + totalLength)
                                          .attr("stroke-dashoffset", totalLength)
                                          .transition()
                                          .duration(duration)
                                          .ease("linear")
                                          .attr("stroke-dashoffset", 0);
                                        break;
                                    case "Prostate":
                                        var path = vis.append('svg:path')
                                          .classed('plotline', true)
                                          .attr('d', lineGen(prostate))
                                          .attr('stroke', 'green')
                                          .attr('stroke-width', 2)
                                          .attr('fill', 'none');
                                        var totalLength = path.node().getTotalLength();

                                        path
                                          .attr("stroke-dasharray", totalLength + " " + totalLength)
                                          .attr("stroke-dashoffset", totalLength)
                                          .transition()
                                          .duration(duration)
                                          .ease("linear")
                                          .attr("stroke-dashoffset", 0);
                                        break;
                                    case "Ovary":
                                        var path = vis.append('svg:path')
                                          .classed('plotline', true)
                                          .attr('d', lineGen(ovary))
                                          .attr('stroke', 'green')
                                          .attr('stroke-width', 2)
                                          .attr('fill', 'none');
                                        var totalLength = path.node().getTotalLength();

                                        path
                                          .attr("stroke-dasharray", totalLength + " " + totalLength)
                                          .attr("stroke-dashoffset", totalLength)
                                          .transition()
                                          .duration(duration)
                                          .ease("linear")
                                          .attr("stroke-dashoffset", 0);
                                        break;
                                    case "Uterus":
                                        var path = vis.append('svg:path')
                                          .classed('plotline', true)
                                          .attr('d', lineGen(uterus))
                                          .attr('stroke', 'green')
                                          .attr('stroke-width', 2)
                                          .attr('fill', 'none');
                                        var totalLength = path.node().getTotalLength();

                                        path
                                          .attr("stroke-dasharray", totalLength + " " + totalLength)
                                          .attr("stroke-dashoffset", totalLength)
                                          .transition()
                                          .duration(duration)
                                          .ease("linear")
                                          .attr("stroke-dashoffset", 0);
                                        break;
                                }
                            }
                        }
                    }

            }
        });
    }

// http://bl.ocks.org/WilliamQLiu/59c87d2bcc00800ec3f9 we should DO THIS

    // We watch the checkbox for changes and re-draw the whole view
    $('input:checkbox').change(
        function(){
            var male = document.getElementById("cmn-toggle-1").checked;
            var death = document.getElementById("cmn-toggle-2").checked;

            if (male && death) {
                console.log("Male Death");
                drawBody("data/male_death.csv", true);

            } else if (male && !death) {
                console.log("Male Incidence");
                drawBody("data/male_incidence.csv", true);
            } else if (!male && death) {
                console.log("Female Death");
                drawBody("data/female_death.csv", false);
            } else if(!male && !death){
                console.log("Female Incidence");
                drawBody("data/female_incidence.csv", false);
            }
        });
});

// --- For section 2017-----------------------
// Declare common variables for both visualizations
var div = d3.select("body").append("div").attr("class", "toolTip");

var margins = {top: 40, right: 40, bottom: 70, left: 100};

var width = 800 - margins.left - margins.right,
    barHeight = 25;

var left_width = 250;
var left_width_label = 240;
var gap = 20, yRangeBand;

// redefine y for adjusting the gap
var yRangeBand = (barHeight + 2 * gap) /2;


d3.csv("data/NewCaseEstimates2017.csv", function(error,data) {
    if (error){
      console.log(error);
    } else {

    var height = barHeight * data.length;

    
    var y = function(i) { return yRangeBand * i + 40; };

    svg = d3.select('#section2017_vis1')
            .append("svg")
            .attr("class","box")
            .attr('width', left_width + width + 40)
            .attr('height', ((barHeight + gap * 2) * data.length + 30)/2 + 80)
            .append("g")
            .attr("transform", "translate(10, 20)");
            

    var max_n = 0;
    for (var d in data) {
        max_n = Math.max(data[d].combined, max_n);
    }


    var dx = width / max_n;
    var dy = height / data.length;


    // bars

    // transparent bars for each data 
    var tbar = svg.selectAll(".tbar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","tbar")
        .attr("x", left_width)
        .attr("y", function(d, i) { return y(i) + yRangeBand/2;})
        .attr("width", function(d, i) {return dx*max_n})
        .attr("height", barHeight);
    
    //Main bar
    var bar = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","bar")
        .attr("x", left_width)
        .attr("y", function(d, i) { return y(i) + yRangeBand/2;})
        .attr("width", function(d, i) {return dx*(d.combined*0.65)})
        .attr("height", barHeight);

    // labels
    var text2 = svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", left_width_label)
        .attr("y", function(d, i) { return y(i) + yRangeBand + 2;})
        .text( function(d) {return d.Type;})
        .attr("text-anchor", "end")
        .attr("class", "textup");

    // Add title
    var text1 = svg.append("text")
        .attr("x", width/1.9)
        .attr("y", 20)
        .style("font-size", "1.5em")
        .style("font-family", "'Oswald', sans-serif")
        .text("Estimated New Cases for 2017")
        .attr("text-anchor", "start")
        .attr("class", "texttitle");
    var formatComma = d3.format(",");
    // Put text on tbar
    var text3 = svg.selectAll("textlabel")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function(d, i) {
                return left_width+dx*(d.combined*0.65)+60;   
        })
        .attr("y", function(d, i) { return y(i) + yRangeBand/2+17;})
        .text( function(d) {return formatComma(d.combined); })
        .attr("text-anchor", "end")
        .attr("class","tlabel");
    
    bar
            .on("mousemove", function(d){
                div.style("left", d3.event.pageX+10+"px");
                div.style("top", d3.event.pageY-25+"px");
                div.style("display", "inline-block");
                div.html((d.Type)+" "+(d.combined));
            });
    bar
            .on("mouseout", function(d){
                div.style("display", "none");
            });
    tbar
            .on("mousemove", function(d){
                div.style("left", d3.event.pageX+10+"px");
                div.style("top", d3.event.pageY-25+"px");
                div.style("display", "inline-block");
                div.html((d.Type)+" "+(d.combined));
            });
    tbar
            .on("mouseout", function(d){
                div.style("display", "none");
            });
}
});
d3.csv("data/DeathEstimates2017.csv", function(error,data) {
    if (error){
      console.log(error);
    } else {

    var height = barHeight * data.length;

    var y = function(i) { return yRangeBand * i + 40; };

    svg = d3.select('#section2017_vis2')
            .append("svg")
            .attr("class","box_death")
            .attr('width', left_width + width + 40)
            .attr('height', ((barHeight + gap * 2) * data.length) /2 + 100)
            .append("g")
            .attr("transform", "translate(10, 20)");
            
            
    var max_n = 0;
    for (var d in data) {
        max_n = Math.max(data[d].combined, max_n);
    }


    var dx = width / max_n;
    var dy = height / data.length;


    // bars

    // transparent bars for each data 
    var tbar = svg.selectAll(".tbar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","tbar")
        .attr("x", left_width)
        .attr("y", function(d, i) { return y(i) + yRangeBand/2;})
        .attr("width", function(d, i) {return dx*max_n})
        .attr("height", barHeight);
    
    //Main bar
    var bar = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","bar")
        .attr("x", left_width)
        .attr("y", function(d, i) { return y(i) + yRangeBand/2;})
        .attr("width", function(d, i) {return dx*(d.combined*0.65)})
        .attr("height", barHeight);

    // labels
    var text2 = svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", left_width_label)
        .attr("y", function(d, i) { return y(i) + yRangeBand + 2;})
        .text( function(d) {return d.Type;})
        .attr("text-anchor", "end")
        .attr("class", "textup");

    // Add title
    var text1t = svg.append("text")
        .attr("x", width/1.9)
        .attr("y", 20)
        .style("font-size", "1.5em")
        .style("font-family", "'Oswald', sans-serif")
        .text("Estimated Death Cases for 2017")
        .attr("text-anchor", "start")
        .attr("class", "texttitle");

    var formatComma = d3.format(",");
    // Put text on tbar
    var text3 = svg.selectAll("textlabel")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function(d, i) {
                return left_width+dx*(d.combined*0.65)+60;   
        })
        .attr("y", function(d, i) { return y(i) + yRangeBand/2+17;})
        .text( function(d) {return formatComma(d.combined); })
        .attr("text-anchor", "end")
        .attr("class","tlabel");
    
    bar
            .on("mousemove", function(d){
                div.style("left", d3.event.pageX+10+"px");
                div.style("top", d3.event.pageY-25+"px");
                div.style("display", "inline-block");
                div.html((d.Type)+" "+(d.combined));
            });
    bar
            .on("mouseout", function(d){
                div.style("display", "none");
            });
    tbar
            .on("mousemove", function(d){
                div.style("left", d3.event.pageX+10+"px");
                div.style("top", d3.event.pageY-25+"px");
                div.style("display", "inline-block");
                div.html((d.Type)+" "+(d.combined));
            });
    tbar
            .on("mouseout", function(d){
                div.style("display", "none");
            });
}
});