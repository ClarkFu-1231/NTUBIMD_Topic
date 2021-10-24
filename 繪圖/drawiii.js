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
//成交量的x
var xVolume = d3.scaleBand().range([0, width]).padding(0.15);

var candlestick = techan.plot.candlestick()
.xScale(x)
.yScale(y);

var zoom = d3.zoom()
        .scaleExtent([1, 10]) //設定縮放大小1 ~ 5倍
        .translateExtent([[0, 0], [width, height]]) // 設定可以縮放的範圍，註解掉就可以任意拖曳
        .extent([[margin.left, margin.top], [width, height]])
        .on("zoom", zoomed);

var zoomableInit, yInit;

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
.ticks(4)
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
var textSvg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 設定文字區域
var textSvg_2 = d3.select("body").append("svg")
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
var svgText_2 = textSvg_2.append("g")
.attr("class", "description")
.append("text")
.attr("y", 6)
.attr("dy", ".71em")
.style("text-anchor", "start")
.text("");

//設定畫圖區域
var svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom )
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataArr;



function drawVolume(){
//https://csvjson.com/ /*Csv to Json*/
svg.selectAll("*").remove(); // 切換不同資料需要重新畫圖，因此需要先清除原先的圖案

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
    .attr("y", -10)
    .style("text-anchor", "end")
    .text("$(TWD)");
// Data to display initially
draw(data.slice(0, data.length));

});
}

function draw(data) {
    // 設定domain，決定各座標所用到的資料
    x.domain(data.map(candlestick.accessor().d));
    y.domain(techan.scale.plot.ohlc(data, candlestick.accessor()).domain());
    xVolume.domain(data.map(function(d){return d.date;}))
    yVolume.domain(techan.scale.plot.volume(data).domain());
    const volData = data.filter(d => d.Volume !== null && d.Volume !== 0);

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);

    // 針對K線圖的，讓他不會蓋到成交量bar chart
    var candlestickClip = svg.append("defs").append("svg:clipPath")
      .attr("id", "candlestickClip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height - 100 )
      .attr("x", 0)
      .attr("y", 0);
    
    xVolume.range([0, width].map(d => d)); // 設定xVolume回到初始值

    var chart = svg.selectAll("g.volume") // 畫成交量bar chart
        .append("g")
        .data(data)
        .enter().append("g")
        .attr("clip-path", "url(#clip)");
    
    chart.append("rect")
        .attr("class", "volumeBar")
        .attr("x", function(d) {return xVolume(d.date);})
        .attr("height", function(d){
            return  height - yVolume(d.volume);
        })
        .attr("y", function(d) {
            return yVolume(d.volume);
        })
        .attr("width", xVolume.bandwidth())
        .style("fill", function(d, i) { // 根據漲跌幅去決定成交量的顏色
            if (i == 0) {
                return '#000000';
              } else {  
                return volData[i - 1].close > d.close ? '#7BA23F': '#DB4D6D' ; 
              }        
    });
   
   // 畫X軸 
    svg.selectAll("g.x.axis").call(xAxis.ticks(7).tickFormat(d3.timeFormat("%m/%d")).tickSize(-height, -height));
    
    //畫K線圖Y軸
    svg.selectAll("g.y.axis").call(yAxis.ticks(10).tickSize(-width, -width));
      
    //畫Ｋ線圖
    var state = svg.selectAll("g.candlestick")
        .attr("clip-path", "url(#candlestickClip)")
        .datum(data);
    state.call(candlestick)
        .each(function(d) {
        dataArr = d;
    });
    
    svg.select("g.sma.ma-0").attr("clip-path", "url(#candlestickClip)").datum(techan.indicator.sma().period(10)(data)).call(sma);
    svg.select("g.sma.ma-1").attr("clip-path", "url(#candlestickClip)").datum(techan.indicator.sma().period(20)(data)).call(sma);
    svg.select("g.sma.ma-2").attr("clip-path", "url(#candlestickClip)").datum(techan.indicator.sma().period(50)(data)).call(sma);
    svg.select("g.volume.axis").call(volumeAxis);
    
    // 畫十字線並對他設定zoom function
    svg.append("g")
    .attr("class", "crosshair")
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", "all")
    .call(crosshair)
    .call(zoom);
    
    //設定zoom的初始值
    zoomableInit = x.zoomable().clamp(false).copy();
    yInit = y.copy();
}

//設定當移動的時候要顯示的文字
function move(coords, index) {
//    console.log("move");
    var i;
    for (i = 0; i < dataArr.length; i ++) {
        if (coords.x === dataArr[i].date) {
            svgText.text(d3.timeFormat("%Y/%m/%d")(coords.x) + ", 開盤價：" + dataArr[i].open + ", 最高：" + dataArr[i].high + ", 最低："+ dataArr[i].low); 
            svgText_2.text("收盤價："+ dataArr[i].close  + ", 成交量：" + dataArr[i].volume)
        }
    }
}

var rescaledX, rescaledY;
var t;
function zoomed() {
    
    //根據zoom去取得座標轉換的資料
    t = d3.event.transform;
    rescaledX = d3.event.transform.rescaleY(x);
    rescaledY = d3.event.transform.rescaleY(y);
    // y座標zoom
    yAxis.scale(rescaledY);
    candlestick.yScale(rescaledY);
    sma.yScale(rescaledY);
   // Emulates D3 behaviour, required for financetime due to secondary zoomable scale
    //K線圖 x zoom
    x.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());
    // 成交量 x  zoom
    xVolume.range([0, width].map(d => d3.event.transform.applyX(d)));
    
    // 更新座標資料後，再重新畫圖
    redraw();
}



function redraw() {
    svg.select("g.candlestick").call(candlestick);
    svg.select("g.x.axis").call(xAxis);
    svg.select("g.y.axis").call(yAxis);
    svg.select("g.sma.ma-0").call(sma);
    svg.select("g.sma.ma-1").call(sma);
    svg.select("g.sma.ma-2").call(sma);
    svg.selectAll("rect.volumeBar")
        .attr("x", function(d) {return xVolume(d.date);})
        .attr("width", (xVolume.bandwidth()));
}
