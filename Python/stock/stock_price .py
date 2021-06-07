import requests
from bs4 import BeautifulSoup
from apscheduler.schedulers.blocking import BlockingScheduler
import pymysql




def stock_price_db(stocks):
    # 資料庫參數設定
    db_settings = {
        "host": "127.0.0.1",
        "port": 3306,
        "user": "root",
        "password": "c23670424989",
        "db": "stock",
        "charset": "utf8"
    }
    
    try:
        # 建立Connection物件
        conn = pymysql.connect(**db_settings)
    # 建立Cursor物件
        with conn.cursor() as cursor:# 新增資料SQL語法
            command = """INSERT INTO market(market_date,stock_name,opening_price,close_price,highest_price,lowest_price,lot)VALUES(%s, %s, %s, %s, %s, %s, %s)"""
            # 取得股票價格
            
            for stock in stocks:
                cursor.execute(command,(stock[0],stock[1],stock[2],stock[3],stock[4],stock[5],stock[6]))
                conn.commit()
            
    except Exception as ex:
        print(ex)
    

#要取得的股票代碼
def stock_symbol():
    stock = [2330,2454]
    for i in stock:
        stock_price(i)
        
    

# 取得股票價格並儲存為串列
def stock_price(symbol):
    
    url="https://tw.stock.yahoo.com/q/q?s="+str(symbol)
    r=requests.get(url)
    soup = BeautifulSoup(r.text,"html.parser")
    table_date = soup.find_all("table")[0]
    market_date = table_date('td')[1]
    tables = soup.find_all("table")[2]#取得網頁中第三個表格(索引從0開始計算)
    stock_name=tables.find_all("td")[0]
    opening_price = tables.find_all("td")[8]#取得表格中第八格
    close_price = tables.find_all("td")[2]
    highest_price = tables.find_all("td")[9]
    lowest_price = tables.find_all("td")[10]
    lot = tables.find_all("td")[6]
    stock_price = []
    stock_price_touple=(market_date.get_text().strip()[-9:],stock_name.get_text().strip("加到投資組合"),opening_price.get_text().strip(),close_price.get_text().strip(),highest_price.get_text().strip(),lowest_price.get_text().strip(),lot.get_text().strip())
    stock_price.append(stock_price_touple)
    stock_price_db(stock_price)
    print(stock_price)
    
    

stock_symbol()

# 排程   
scheduler = BlockingScheduler()
scheduler.add_job(stock_symbol, 'cron', day_of_week='1-5', hour=14, minute=35)
scheduler.start()
    