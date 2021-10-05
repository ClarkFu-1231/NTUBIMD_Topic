import requests
from bs4 import BeautifulSoup
import pymysql

def crawl_financial_report_BalanceSheetURL(stock_number,stock_name, year, season): # 資產負債表
    url = "https://mops.twse.com.tw/mops/web/ajax_t164sb03";
    form_data = {
        'encodeURIComponent': 1,
        'step': 1,
        'firstin': 1,
        'off': 1,
        'co_id': stock_number,
        'year': year,
        'season': season,
    }
    r = requests.post(url, form_data)
    soup = BeautifulSoup(r.text,"html.parser")
    report_date = soup.find(class_="hasBorder")
    count = len(report_date.find_all('tr'))
    day = "民國"+str(year)+"第"+str(season)+"季"
    BalanceSheet = ()
    BalanceSheet+= (day,str(stock_number)+stock_name)
    BalanceSheet_text =("現金及約當現金","透過損益按公允價值衡量之金融資產－流動","應收帳款淨額","存貨","流動資產合計","採用權益法之投資","不動產、廠房及設備","資產總額","短期借款","應付帳款","流動負債合計","負債總額","權益總額")
    for i in range(4,count,1):
        a = 0
        date = report_date.find_all('tr')[i]
        next_date = date.find_all("td")[0].get_text().lstrip()
        for a in range(13):
            if next_date == BalanceSheet_text[a]:
              BalanceSheet+= (date.find_all("td")[1].get_text().lstrip(),) 
    return BalanceSheet

def crawl_financial_report_ProfitAndLoseURL(stock_number, year, season): # 綜合損益表
    url = "https://mops.twse.com.tw/mops/web/ajax_t164sb04";
    form_data = {
        'encodeURIComponent': 1,
        'step': 1,
        'firstin': 1,
        'off': 1,
        'co_id': stock_number,
        'year': year,
        'season': season,
    }
    r = requests.post(url, form_data)
    soup = BeautifulSoup(r.text,"html.parser")
    report_date = soup.find(class_="hasBorder")
    count = len(report_date.find_all('tr'))
    ProfitAndLose = ()
    ProfitAndLose_text =("營業收入合計","營業毛利（毛損）","推銷費用","管理費用","研究發展費用","營業費用合計","營業利益（損失）","稅前淨利（淨損）","本期淨利（淨損）","母公司業主（淨利∕損）","基本每股盈餘")
    for i in range(4,count,1):
        a = 0
        date = report_date.find_all('tr')[i]
        next_date = date.find_all("td")[0].get_text().lstrip()
        for a in range(11):
            if next_date == ProfitAndLose_text[a]:
              ProfitAndLose+= (date.find_all("td")[1].get_text().lstrip(),) 
    return ProfitAndLose

def crawl_financial_report_CashFlowStatementURL(stock_number, year, season): # 現金流量表
    url = "https://mops.twse.com.tw/mops/web/ajax_t164sb05";
    form_data = {
        'encodeURIComponent': 1,
        'step': 1,
        'firstin': 1,
        'off': 1,
        'co_id': stock_number,
        'year': year,
        'season': season,
    }
    r = requests.post(url, form_data)
    soup = BeautifulSoup(r.text,"html.parser")
    report_date = soup.find(class_="hasBorder")
    count = len(report_date.find_all('tr'))
    CashFlowStatement = ()
    CashFlowStatement_text =("折舊費用","攤銷費用","營業活動之淨現金流入（流出）","投資活動之淨現金流入（流出）","取得不動產、廠房及設備")
    for i in range(4,count,1):
        a = 0
        date = report_date.find_all('tr')[i]
        next_date = date.find_all("td")[0].get_text().lstrip()
        for a in range(5):
            if next_date == CashFlowStatement_text[a]:
              CashFlowStatement+= (date.find_all("td")[1].get_text().lstrip(),) 
    return CashFlowStatement
        
def financial_report_db(financial_reports):
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
            command = """INSERT INTO financial_report(財報季度,股票名稱,現金及約當現金,短期投資,應收帳款淨額,存貨,流動資產,長期投資,固定資產,總資產,短期借款,應付帳款,流動負債,總負債,權益總額,營業收入,營業毛利,銷售費用,管理費用,研發費用,營業費用,營業利益,稅前淨利,稅後淨利,母公司業主淨利,空白,每股盈餘,折舊費用,攤銷費用,營業活動之現金流量,投資活動之淨現金流,資本支出)VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            # 取得股票價格
            
            for financial_report in financial_reports:
                
                cursor.execute(command,(financial_report))
                conn.commit()
            
    except Exception as ex:
        print(ex)

def stock_search():
    Financial_report = []
    stock_number = 2330
    stock_name = "台積電"
    year = 108
    season = 4
    BalanceSheet = crawl_financial_report_BalanceSheetURL(stock_number,stock_name, year, season)
    ProfitAndLose = crawl_financial_report_ProfitAndLoseURL(stock_number, year, season)
    CashFlowStatement = crawl_financial_report_CashFlowStatementURL(stock_number, year, season)
    Total_Touple = BalanceSheet+ProfitAndLose+CashFlowStatement
    print(BalanceSheet)
    print(ProfitAndLose)
    print(CashFlowStatement)
    Financial_report.append(Total_Touple)
    financial_report_db(Financial_report)
    
    
stock_search()
        