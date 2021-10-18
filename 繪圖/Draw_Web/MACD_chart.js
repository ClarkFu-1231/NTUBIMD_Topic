var margin = {top: 20, right: 50, bottom: 30, left: 50},
            width =  window.innerWidth - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y-%m-%d");

var xScale = techan.scale.financetime().range([0, width]);

var yScale = d3.scaleLinear().range([height, 0]);

var macd = techan.plot.macd()
        .xScale(xScale)
        .yScale(yScale);

// 增加x軸線，tickSize是軸線的垂直高度，-h會往上拉高
var xAxis = d3.axisBottom(xScale).tickSize(-height);

// 建立y軸線
var yAxis = d3.axisLeft(yScale).tickFormat(d3.format(",.3")).tickSize(-width);

//增加一個SVG元素
var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)//將左右補滿
        .attr("height", height + margin.top + margin.bottom)//上下補滿
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//https://csvjson.com/ /*Csv to Json*/
d3.json("./DATASET/2330.json", function(error, data) {
        var accessor = macd.accessor();
        data = data.map(function(d) {
            return {
                date: parseDate(d.Date), //日期
                volume: +d.Volume,//成交量
                open: +d.Open,   //開盤
                high: +d.High,   //最高點
                low: +d.Low,     //最低點
                close: +d.Close //收盤
                
            };
        }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
        
        svg.append("g")
                .attr("class", "macd");

        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")");

        svg.append("g")
                .attr("class", "y axis")
                .append("text")
                .attr("transform", 'translate(0,0)')
                .text("MACD");
        
        // Data to display initially
        draw(data.slice(0, data.length));
        
   
});

function draw(data) {
        var macdData = techan.indicator.macd()(data);
        xScale.domain(macdData.map(macd.accessor().d));
        yScale.domain(techan.scale.plot.macd(macdData).domain());

        svg.selectAll("g.macd").datum(macdData).call(macd);
        svg.selectAll("g.x.axis").call(xAxis);
        svg.selectAll("g.y.axis").call(yAxis);  
        
}
