import requests
from bs4 import BeautifulSoup
import pymysql

def get_dividend_db(datas):
    # 資料庫參數設定
    db_settings = {
        "host": "127.0.0.1",
        "port": 3306,
        "user": "root",
        "password": "C23670424989",
        "db": "stock",
        "charset": "utf8"
    }
    
    try:
        # 建立Connection物件
        conn = pymysql.connect(**db_settings)
    # 建立Cursor物件
        with conn.cursor() as cursor:# 新增資料SQL語法
            command = """INSERT INTO 股利政策(股票代號,除權息日,除權息前股價,配息,配股,現金殖利率,股票殖利率,合計殖利率,本益比,EPS,填息天數,填息日期)VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            # 取得股票價格
            
            for data in datas:
                
                cursor.execute(command,(data))
                conn.commit()
            
    except Exception as ex:
        print(ex)

def get_dividend(stock):
    r = requests.get("https://stockinfo.tw/dividends/?stockSearch="+str(stock)) #將網頁資料GET下來
    html = BeautifulSoup(r.text,"html.parser") #將網頁資料以html.parser
    tbody = html.find("tbody")
    # tr = tbody.find_all("tr")擷取出tr
    count_tr = len(tbody.find_all('tr'))
    for i in range(1,count_tr):
        tr = tbody.find_all("tr")[i]
        count_td = len(tr.find_all('td'))
        date = tr.find_all("td")[0].get_text()
        if len(date[:10])!="":
            date_2 = date[:10]
        else:
            date_2 = date[:9]
        data_array = []
        data_tuple = ()
        data_tuple = (str(stock),)
        data_tuple+=(date_2,)
        for i in range(1,count_td):
            td = tr.find_all("td")[i].get_text()
            data_tuple+=(td,)
        data_array.append(data_tuple)
        get_dividend_db(data_array)
        print(data_array)

get_dividend(1101)
