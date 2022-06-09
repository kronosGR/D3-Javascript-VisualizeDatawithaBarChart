var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#result")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

svg.append("text")
.attr('transform', "translate(100,0)")
.attr("x", 50)
.attr("y", 50)
.text('Federal Reserve Economic Data')    


// const g = svg.append("g")
//   .attr("fill","blue")
  

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(json =>{
    const data = json.data
    console.log(data)
    
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d=>d[1])])
      .range([0, height]);

    const xAxis = d3.axisBottom().scale(xScale);

    const yScale= d3.scaleLinear()
      .domain([0, d3.max(data, d=>d[1])])
      .range([height, 0])
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .call(xAxis)
      .attr('transform', `translate(60, ${height+10})`);
    
    svg.append('g')
      .call(yAxis)
      .attr('transform', translate(60,0))

  // svg.append("g")
  //   .call(d3.axisLeft(y))

    svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", function(d,i) { return d[1]})
      .attr("y", function(d) { return height-d[1]})
      .attr("width", 10)
      .attr("height", function(d) { return xScale(d[1]); })
      .attr("fill", "#69b3a2")
   

  })