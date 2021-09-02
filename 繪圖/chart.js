class HistoricalPriceChart{
    //建構子解釋:https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Classes/constructor
    constructor(){
        this.margin;
        this.width;
        this.height;
        this.xscale;
        this.yscale;
        this.zoom;
        this.currentData = [];//當前顯示資料
        this.dividenData = [];//股利資料
        this.bollingerBandsData = undefined; //布林通道資料
        this.movingAverageData = undefined; //移動平均資料
        this.loadData('vig').then(data =>{
            this.initialiseChart(data);//初始化圖表
        });

        //下拉式選單選擇股票
        const selectElement = document.getElementById('select-stock');
        selectElement.addEventListener('change', event =>{ 
            this.setDataset(event);
        });

        //若勾選了close這個選項
        const viewClose = document.querySelector('input[id=close]');
        viewClose.addEventListener('change', event =>{
            this.toggleClose(document.querySelector('input[id=close]').checked);
        });

        //若勾選了MovingAverage這個選項
        const viewMovingAverage = document.querySelector('input[id=moving-average]');
        viewMovingAverage.addEventListener('change', event =>{
            this.toggleMovingAverage(document.querySelector('input[id=moving-average]').checked);
        });

        //若勾選了ohlc這個選項
        const viewOHLC = document.querySelector('input[id=ohlc]');
        viewOHLC.addEventListener('change', event =>{
            this.toggleOHLC(document.querySelector('input[id=ohlc]').checked);
        });

        //若勾選了Candlesticks這個選項
        const viewCandlesticks = document.querySelector('input[id=candlesticks]');
        viewCandlesticks.addEventListener('change', event =>{
            this.toggleCandlesticks(document.querySelector('input[id=candlesticks]').checked);
        });

        //若勾選了BollingerBands這個選項
        const viewBollingerBands = document.querySelector('input[id=bollingerbands]');
        viewBollingerBands.addEventListener('change', event =>{
            this.toggleBollingerBands(document.querySelector('input[id=bollingerbands]').checked);
        });
    }
    //判別選哪支股票並載入資料 
    loadData(selectedDataset = 'vig') {
        let loadFile = '';
        if (selectedDataset === 'vig') {
          loadFile = 'sample-data-vig.json';
        } else if (selectedDataset === 'vti') {
          loadFile = 'sample-data-vti.json';
        } else if (selectedDataset === 'vea') {
          loadFile = 'sample-data-vea.json';
        }
        return d3.json(loadFile).then(data =>{
            const chartResultsData = data['chart']['result'][0];
            const quoteData = chartResultsData['indicators']['quote'][0];
            return {
                dividends: Object.values(chartResultsData['events']['dividends']).map(//dividends(股息)
                  res => {
                    return {
                      date: new Date(res['date'] * 1000),
                      yield: res['amount']
                    };
                  }
                ),
                quote: chartResultsData['timestamp'].map((time, index) => ({
                    date: new Date(time * 1000),//交易日
                    high: quoteData['high'][index],//最高價
                    low: quoteData['low'][index],//最低價
                    open: quoteData['open'][index],//開盤價
                    close: quoteData['close'][index],//收盤價
                    volume: quoteData['volume'][index]//交易量
                }))
            };
        });
    }
    //計算平均線
    calculateMovingAverage(data, numberOfPricePoints){
        return data.map((row, index, total)=>{
            const start = Math.max(0, index - numberOfPricePoints);
            const end = index;
            const subset = total.slice(start, end +1 );
            const sum =subset.reduce((a,b)=>{
                return a+b['close'];
            }, 0);

            return{
                data: row['date'],
                aberage: sum / subset.length
            };
        });
    }

    //計算布林通道
    calculateBollingerBands(data, numberOfPricePoints) {
        let sumSquaredDifference = 0;
        return data.map((row, index, total) => {
          const start = Math.max(0, index - numberOfPricePoints);
          const end = index;
          const subset = total.slice(start, end + 1);
          const sum = subset.reduce((a, b) => {
            return a + b['close'];
          }, 0);
    
          const sumSquaredDifference = subset.reduce((a, b) => {
            const average = sum / subset.length;
            const dfferenceFromMean = b['close'] - average;
            const squaredDifferenceFromMean = Math.pow(dfferenceFromMean, 2);
            return a + squaredDifferenceFromMean;
          }, 0);
          const variance = sumSquaredDifference / subset.length;
    
          return {
            date: row['date'],
            average: sum / subset.length,
            standardDeviation: Math.sqrt(variance),
            upperBand: sum / subset.length + Math.sqrt(variance) * 2,
            lowerBand: sum / subset.length - Math.sqrt(variance) * 2
          };
        });
      }

    initialiseChart(data){
        const thisYearStartDate = new Date(2018, 4, 31);
        const nextYearStartDate = new Date(2019, 0, 1);
        //remove invalid data points
        const validData = data['quote'].filter(
            row => row['high'] && row['low'] && row['close'] && row['open']
          );
        //filter out data based on time period
        this.currentData = validData.filter(row => {
            if (row['date']) {
              return (
                row['date'] >= thisYearStartDate && row['date'] < nextYearStartDate
              );
            }
          });
        // calculates simple moving average over 50 days
        this.movingAverageData = this.calculateMovingAverage(validData, 49);
        // calculates simple moving average, and standard deviation over 20 days
        this.bollingerBandsData = this.calculateBollingerBands(validData, 19);  

        const viewportWidth = Math.max(
            document.documentElement.clientWidth,
            window.innerWidth
          );
        const viewportHeight = Math.max(
            document.documentElement.clientHeight,
            window.innerHeight
          );
        this.margin = { top: 50, right: 50, bottom: 50, left: 20 };
        if (viewportWidth <= 768) {
            this.width = viewportWidth - this.margin.left - this.margin.right; // Use the window's width
            this.height = 0.5 * viewportHeight - this.margin.top - this.margin.bottom; // Use the window's height
        } else {
            this.width = 0.75 * viewportWidth - this.margin.left - this.margin.right;
            this.height = viewportHeight - this.margin.top - this.margin.bottom; // Use the window's height
        }

        //find data range
        const xMin = d3.min(this.currentData, d => d['date'])
        const xMax = d3.max(this.currentData, d => d['date'])
        const yMin = d3.min(this.currentData, d => d['date'])
        const yMax = d3.max(this.currentData, d => d['date'])
        
        // scale using range
        this.xScale = d3.scaleTime()
                        .domain([xMin, xMax])
                        .range([0, this.width]);

        this.yScale = d3.scaleLinear()
                        .domain([yMin - 5, yMax + 4])
                        .range([this.height, 0]);

        // add chart SVG to the page
        const svg = d3.select('#chart')
                        .append('svg')
                        .attr('width', this.width + this.margin['left'] + this.margin['right'])
                        .attr('height', this.height + this.margin['top'] + this.margin['bottom'])
                        .append('g')
                        .attr('transform',`translate(${this.margin['left']}, ${this.margin['top']})`
        );

        // create the axes component
        this.xAxis = svg.append('g')
                        .attr('class', 'xAxis')
                        .attr('transform', `translate(0, ${this.height})`)
                        .call(d3.axisBottom(this.xScale));

        this.yAxis = svg.append('g')
                        .attr('class', 'yAxis')
                        .attr('transform', `translate(${this.width}, 0)`)
                        .call(d3.axisRight(this.yScale));
        svg.append('g')
            .attr('id', 'leftAxis')
            .attr('transform', `translate(0, 0)`);

         // define x and y crosshair properties
        const focus = svg.append('g')
                        .attr('class', 'focus')
                        .style('display', 'none');
        focus.append('circle').attr('r', 4.5);
        focus.append('line').classed('x', true);
        focus.append('line').classed('y', true);

        svg.append('rect')
            .attr('class', 'overlay')
            .attr('width', this.width)
            .attr('height', this.height);
  
        d3.select('.overlay')
            .style('fill', 'none')
            .style('pointer-events', 'all');
    
        d3.selectAll('.focus line')
            .style('fill', 'none')
            .style('stroke', '#67809f')
            .style('stroke-width', '1.5px')
            .style('stroke-dasharray', '3 3');
        // get VIG dividend data for year of 2018
        this.dividendData = data['dividends'].filter(row => {
            if (row['date']) {
            return (
                row['date'] >= thisYearStartDate && row['date'] < nextYearStartDate
            );
            }
        });

        
        
        
        
    } 

}