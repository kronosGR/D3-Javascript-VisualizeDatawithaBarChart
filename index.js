var margin = { top: 30, right: 30, bottom: 70, left: 60 },
  width = 860 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var svg = d3
  .select('#result')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

const popup = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('opacity', 0);

svg
  .append('text')
  .attr('transform', 'translate(100,0)')
  .attr('x', 50)
  .attr('y', 50)
  .text('Federal Reserve Economic Data')
  .attr('id', 'title');

d3.json(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
).then((json) => {
  const data = json.data;

  let xScale = d3
    .scaleTime()
    .domain([d3.min(data, (d) => new Date(d[0])), d3.max(data, (d) => new Date(d[0]))])
    .range([0, width]);

  const xAxis = d3.axisBottom(xScale);

  svg
    .append('g')
    .call(xAxis)
    .attr('transform', `translate(60,${height})`)
    .attr('id', 'x-axis');

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([height, 0]);
  const yAxis = d3.axisLeft(yScale);

  svg.append('g').call(yAxis).attr('transform', `translate(60, 0)`).attr('id', 'y-axis');

  const items = data.map((item) => item[1]);
  const years = data.map((item) => new Date(item[0]));
  const itemsMax = d3.max(items);

  // console.log(itemsMax);

  const linearScale = d3.scaleLinear().domain([0, itemsMax]).range([0, height]);

  const scaledItems = items.map((item) => linearScale(item));
  svg
    .selectAll('rect')
    .data(scaledItems)
    .enter()
    .append('rect')
    .attr('x', function (d, i) {
      return 61 + xScale(years[i]);
    })
    .attr('y', function (d) {
      return height - d;
    })
    .attr('width', 10)
    .attr('height', function (d) {
      return d;
    })
    .attr('class', 'bar')
    .attr('data-date', (d, i) => {
      return data[i][0];
    })
    .attr('data-gdp', (d, i) => {
      return data[i][1];
    })
    .attr('data-idx', (d, i) => i)
    .on('mouseover', (e, d) => {
      const idx = e.target.getAttribute('data-idx');
      // console.log(e.target.getAttribute('data-idx'))
      const cords = d3.pointer(e);

      popup
        .attr('id', 'tooltip')
        .style('height', '30px')
        .style('width', 10)
        .style('opacity', 1)
        .style('top', cords[1] + 'px')
        .style('left', cords[0] + 'px')
        .attr('data-date', data[idx][0]).html(` ${data[idx][0]}
            <br>
            $${scaledItems[idx].toFixed(2)}bn
        `);
    })
    .on('mouseout', () => {
      popup.style('opacity', 0);
    });
});
