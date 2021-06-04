import requests
from bs4 import BeautifulSoup
from apscheduler.schedulers.blocking import BlockingScheduler
import pymysql
import stock_price


def stock_price_db(sdb):
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
        with conn.cursor() as cursor:
            # 新增資料SQL語法
            command = "INSERT INTO stock_price(stock_symble, time, open,close,heigh,low,buy,sell,board lot)VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s)"
            # 取得股票價格
            stock_price_dbs = sdb
            for stock_price_db in stock_price_dbs:
                cursor.execute(
                    command, (stock_price_db["stock symble"], stock_price_db["time"], stock_price_db["open"],stock_price_db["close"],stock_price_db["heigh"],stock_price_db["low"],stock_price_db["buy"],stock_price_db["sell"],stock_price_db["board lot"]))
            # 儲存變更
            conn.commit()
            
    except Exception as ex:
        print(ex)
    

#要取得的股票代碼
def stock_symbol():
    stock = [2330,2454]
    for i in stock:
        s = stock_price(i)
        stock_price_db(s)
    

# 取得股票價格並存入
def stock_price(symbol):
    
    url="https://tw.stock.yahoo.com/q/q?s="+str(symbol)
    r=requests.get(url)
    soup = BeautifulSoup(r.text,"html.parser")
    table_date = soup.find_all("table")[0]
    date = table_date('td')[1]
    tables = soup.find_all("table")[2]#取得網頁中第三個表格(索引從0開始計算)
    title=tables.find_all("td")[0]
    open = tables.find_all("td")[8]#取得表格中第八格
    close = tables.find_all("td")[2]
    shares = tables.find_all("td")[6]
    height = tables.find_all("td")[9]
    low = tables.find_all("td")[10]
    buy = tables.find_all("td")[3]
    sell = tables.find_all("td")[4]
    board_lot = tables.find_all("td")[6]
    stock_price = []
    stock_price.append(title.get_text().strip("加到投資組合"),)
    stock_price.append([date.get_text().strip()[-9:]])
    stock_price.append(open.get_text())
    stock_price.append(close.get_text())
    stock_price.append(height.get_text())
    stock_price.append(low.get_text())
    stock_price.append(buy.get_text())
    stock_price.append(sell.get_text())
    stock_price.append(board_lot.get_text())
    stock_price.append(shares.get_text())
    return stock_price

stock_symbol()

# 排程   
scheduler = BlockingScheduler()
scheduler.add_job(stock_symbol, 'cron', day_of_week='1-5', hour=14, minute=30)
scheduler.start()
    