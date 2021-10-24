datapath="./DATASET/23301Y.json"
//K線圖+交易量
function drawplus(){

var margin = {top: 20, right: 50, bottom: 30, left: 50},
            width =  window.innerWidth - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;
// 設定時間格式
var parseDate = d3.timeParse("%Y-%m-%d");
// K線圖的x
var x = techan.scale.financetime()
        .range([0, width]);
var crosshairY = d3.scaleLinear()
        .range([height, 0]);
// K線圖的y
var y = d3.scaleLinear()
        .range([height - 100, 0]);
// 成交量的y
var yVolume = d3.scaleLinear()
        .range([height , height - 100]);

var candlestick = techan.plot.candlestick()
        .xScale(x)
        .yScale(y);


var volume = techan.plot.volume()
        .accessor(candlestick.accessor())
        .xScale(x)
        .yScale(yVolume);
var sma = techan.plot.sma()
        .xScale(x)
        .yScale(y);

var xAxis = d3.axisBottom()
        .scale(x);

var yAxis = d3.axisLeft()
        .scale(y);
var volumeAxis = d3.axisRight(yVolume)
        .ticks(3)
        .tickFormat(d3.format(",.3s"));
var ohlcAnnotation = techan.plot.axisannotation()
        .axis(yAxis)
        .orient('left')
        .format(d3.format(',.2f'));
var timeAnnotation = techan.plot.axisannotation()
        .axis(xAxis)
        .orient('bottom')
        .format(d3.timeFormat('%Y-%m-%d'))
        .translate([0, height]);
// 設定十字線
var crosshair = techan.plot.crosshair()
        .xScale(x)
        .yScale(crosshairY)
        .xAnnotation(timeAnnotation)
        .yAnnotation(ohlcAnnotation)
        .on("move", move);
// 設定文字區域
var textSvg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//設定顯示文字，web版滑鼠拖曳就會顯示，App上則是要點擊才會顯示
var svgText = textSvg.append("g")
            .attr("class", "description")
            .append("text")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "start")
            .text("");
//設定畫圖區域
var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataArr;

//https://csvjson.com/ /*Csv to Json*/
d3.json(datapath, function(error, data) {
        var accessor = candlestick.accessor();
        data = data.map(function(d) {
            return {
                date: parseDate(d.Date), //日期
                open: +d.Open,   //開盤
                high: +d.High,   //最高點
                low: +d.Low,     //最低點
                close: +d.Close, //收盤
                volume: +d.Volume//成交量
            };
        }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });
        
        svg.append("g")
                .attr("class", "sma ma-0");
        svg.append("g")
                .attr("class", "sma ma-1");
        svg.append("g")
                .attr("class", "sma ma-2");
        svg.append("g")
                .attr("class", "candlestick");
        svg.append("g")
                .attr("class", "volume");
        svg.append("g")
                .attr("class", "volume axis");
        
        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")");

        svg.append("g")
                .attr("class", "y axis")
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price ($)");
        
        
        // Data to display initially
        draw(data.slice(0, data.length));
   
});

function draw(data) {
        
//   console.log(data); 
    x.domain(data.map(candlestick.accessor().d));
    y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());
    dataArr = data;
    
    svg.selectAll("g.x.axis").call(xAxis.ticks(7).tickFormat(d3.timeFormat("%m/%d")).tickSize(-height, -height));
    svg.selectAll("g.y.axis").call(yAxis.ticks(10).tickSize(-width, -width));
    yVolume.domain(techan.scale.plot.volume(data).domain());

    svg.append("g")
        .attr("class", "crosshair")
        .call(crosshair)
    
    svg.select("g.volume").datum(data)
        .call(volume);
    
    svg.select("g.volume.axis").call(volumeAxis);
    svg.selectAll("g.candlestick").datum(data).call(candlestick);
    svg.select("g.sma.ma-0").datum(techan.indicator.sma().period(10)(data)).call(sma);
    svg.select("g.sma.ma-1").datum(techan.indicator.sma().period(30)(data)).call(sma);
    svg.select("g.sma.ma-2").datum(techan.indicator.sma().period(50)(data)).call(sma);
}

function move(coords) {
    var i;
    for (i = 0; i < dataArr.length; i ++) {
        if (coords.x === dataArr[i].date) {
            svgText.text(d3.timeFormat("%Y/%m/%d")(coords.x) + ", 開盤：" + dataArr[i].open + ", 高：" + dataArr[i].high + ", 低："+ dataArr[i].low + ", 收盤："+ dataArr[i].close  + ", 成交量： " + dataArr[i].volume );
        }
    }
}
}
//K線圖+MACD
function drawminus(){
var margin = {top: 20, right: 50, bottom: 30, left: 50},
width =  window.innerWidth - margin.left - margin.right,
height = 700 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y-%m-%d");

var x = techan.scale.financetime()
    .range([0, width]);
var crosshairY = d3.scaleLinear()
    .range([height, 0]);

var y = d3.scaleLinear().range([height - 100, 0]);

var yMACD = d3.scaleLinear().range([height , height - 100]);

var candlestick = techan.plot.candlestick()
    .xScale(x)
    .yScale(y);


var macd = techan.plot.macd()
    .xScale(x)
    .yScale(yMACD);

var xAxis = d3.axisBottom().scale(x);

var yAxis = d3.axisLeft().scale(y);

var MACDAxis = d3.axisLeft(yMACD)
    .ticks(3)
    .tickFormat(d3.format(",.3s"));

var ohlcAnnotation = techan.plot.axisannotation()
    .axis(yAxis)
    .orient('left')
    .format(d3.format(',.2f'));
var timeAnnotation = techan.plot.axisannotation()
    .axis(xAxis)
    .orient('bottom')
    .format(d3.timeFormat('%Y-%m-%d'))
    .translate([0, height]);

var crosshair = techan.plot.crosshair()
    .xScale(x)
    .yScale(crosshairY)
    .xAnnotation(timeAnnotation)
    .yAnnotation(ohlcAnnotation)

    .on("move", move);
var textSvg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svgText = textSvg.append("g")
        .attr("class", "description")
        .append("text")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "start")
        .text("");

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataArr;

//https://csvjson.com/ /*Csv to Json*/
d3.json(datapath, function(error, data) {
    var accessor = candlestick.accessor();
    data = data.map(function(d) {
        return {
            date: parseDate(d.Date), //日期
            open: +d.Open,   //開盤
            high: +d.High,   //最高點
            low: +d.Low,     //最低點
            close: +d.Close, //收盤
            volume: +d.Volume//成交量
        };
    }).sort(function(a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });

    svg.append("g")
            .attr("class", "candlestick");
    
    svg.append("g")
            .attr("class", "macd");
    
    svg.append("g")
            .attr("class", "MACD axis");
    
    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

    svg.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");
    
    
    // Data to display initially
    draw(data.slice(0, data.length));
});

function draw(data) {
    var macdData = techan.indicator.macd()(data);   

x.domain(data.map(candlestick.accessor().d));
y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());
dataArr = data;

svg.selectAll("g.x.axis").call(xAxis.ticks(7).tickFormat(d3.timeFormat("%m/%d")).tickSize(-height, -height));
svg.selectAll("g.y.axis").call(yAxis.ticks(10).tickSize(-width, -width));
yMACD.domain(techan.scale.plot.macd(macdData).domain());

svg.append("g")
    .attr("class", "crosshair")
    .call(crosshair)

svg.select("g.macd").datum(macdData)
    .call(macd);

svg.select("g.macd.axis").call(MACDAxis);
svg.selectAll("g.candlestick").datum(data).call(candlestick);
}


function move(coords) {
var i;
for (i = 0; i < dataArr.length; i ++) {
    if (coords.x === dataArr[i].date) {
        svgText.text(d3.timeFormat("%Y/%m/%d")(coords.x) + ", 開盤：" + dataArr[i].open + ", 高：" + dataArr[i].high + ", 低："+ dataArr[i].low + ", 收盤："+ dataArr[i].close  + ", 成交量： " + dataArr[i].volume );
    }
}
}       
}

drawminus();
//drawplus();