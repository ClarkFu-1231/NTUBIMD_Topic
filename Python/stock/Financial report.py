import requests
from bs4 import BeautifulSoup
import pymysql


# BalanceSheet = "https://mops.twse.com.tw/mops/web/ajax_t164sb03";  # 資產負債表
# ProfitAndLose = "https://mops.twse.com.tw/mops/web/ajax_t164sb04";  # 綜合損益表
# CashFlowStatement = "https://mops.twse.com.tw/mops/web/ajax_t164sb05";  # 現金流量表


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
    date = report_date.find_all('tr')[0].get_text()#財報季度
    cash_and_cash_equivalents = report_date.find_all('tr')[5]
    next_cash_and_cash_equivalents = cash_and_cash_equivalents.find_all("td")[1].get_text().lstrip()#現金及約當現金
    current_investment = report_date.find_all('tr')[6]
    next_current_investment = current_investment.find_all("td")[1].get_text().lstrip()#短期投資
    Accounts_Receivable_ = report_date.find_all('tr')[10]
    next_current_investment_Accounts_Receivable = Accounts_Receivable_.find_all("td")[1].get_text().lstrip()#應收帳款淨額
    inventory = report_date.find_all('tr')[13]
    next_inventory = inventory.find_all("td")[1].get_text().lstrip()#存貨
    Current_Assets = report_date.find_all('tr')[15]
    next_Current_Assets = Current_Assets.find_all("td")[1].get_text().lstrip()#流動資產
    Long_Term_Investments = report_date.find_all('tr')[19]
    nextLong_Term_Investments = Long_Term_Investments.find_all("td")[1].get_text().lstrip()#長期投資
    Fixed_Assets = report_date.find_all('tr')[20]
    next_LongFixed_Assets = Fixed_Assets.find_all("td")[1].get_text().lstrip()#固定資產
    Total_Assets = report_date.find_all('tr')[26]
    next_Total_Assets = Total_Assets.find_all("td")[1].get_text().lstrip()#總資產
    Short_Term_Borrowings = report_date.find_all('tr')[28]
    next_Short_Term_Borrowings = Short_Term_Borrowings.find_all("td")[1].get_text().lstrip()#短期借款
    Short_Term_Notes_and_Bills_Payable = report_date.find_all('tr')[29]
    nextShort_Term_Notes_and_Bills_Payable = Short_Term_Notes_and_Bills_Payable.find_all("td")[1].get_text().lstrip()#應付短期票據
    Accounts_Payable = report_date.find_all('tr')[32]
    next_Accounts_Payable = Accounts_Payable.find_all("td")[1].get_text().lstrip()#應付帳款
    Current_Liabilities = report_date.find_all('tr')[37]
    next_Current_Liabilities = Current_Liabilities.find_all("td")[1].get_text().lstrip()#流動負債
    Total_Liabilities = report_date.find_all('tr')[45]
    next_Total_Liabilities = Total_Liabilities.find_all("td")[1].get_text().lstrip()#總負債
    Total_Equity = report_date.find_all('tr')[67]
    next_Total_Equity = Total_Equity.find_all("td")[1].get_text().lstrip()#權益總額
   
    BalanceSheet = (date,str(stock_number)+stock_name,next_cash_and_cash_equivalents,next_current_investment,next_current_investment_Accounts_Receivable,next_inventory,next_Current_Assets,nextLong_Term_Investments,next_LongFixed_Assets,next_Total_Assets,next_Short_Term_Borrowings,nextShort_Term_Notes_and_Bills_Payable,next_Accounts_Payable, next_Current_Liabilities,next_Total_Liabilities,next_Total_Equity)
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
    Operating_Income = report_date.find_all('tr')[4]
    next_Operating_Income =  Operating_Income.find_all("td")[1].get_text().lstrip()#營業收入
    Gross_Income_from_Operations = report_date.find_all('tr')[6]
    next_Gross_Income_from_Operations =  Gross_Income_from_Operations.find_all("td")[1].get_text().lstrip()#營業毛利
    Marketing_Expense = report_date.find_all('tr')[10]
    next_Marketing_Expense =  Marketing_Expense.find_all("td")[1].get_text().lstrip()#銷售費用
    Administrative_expenses = report_date.find_all('tr')[11]
    next_Administrative_expenses =  Administrative_expenses.find_all("td")[1].get_text().lstrip()#管理費用
    Research_and_development_expenses = report_date.find_all('tr')[12]
    next_Research_and_development_expenses =  Research_and_development_expenses.find_all("td")[1].get_text().lstrip()#研發費用
    Operating_Expenses = report_date.find_all('tr')[13]
    next_Operating_Expenses =  Operating_Expenses.find_all("td")[1].get_text().lstrip()#營業費用
    Operating_Income = report_date.find_all('tr')[16]
    next_Operating_Income =  Operating_Income.find_all("td")[1].get_text().lstrip()#營業利益
    profit_before_tax = report_date.find_all('tr')[24]
    next_profit_before_tax =   profit_before_tax.find_all("td")[1].get_text().lstrip()#稅前淨利
    profit_after_tax = report_date.find_all('tr')[27]
    next_profit_after_tax = profit_after_tax.find_all("td")[1].get_text().lstrip()#稅後淨利
    CNIS = report_date.find_all('tr')[41]
    next_CNIS = CNIS.find_all("td")[1].get_text().lstrip()#母公司業主淨利
    EPS = report_date.find_all('tr')[48]
    next_EPS = EPS.find_all("td")[1].get_text().lstrip()#每股盈餘
    ProfitAndLose = (next_Operating_Income,next_Gross_Income_from_Operations,next_Marketing_Expense,next_Administrative_expenses,next_Research_and_development_expenses,next_Operating_Expenses,next_Operating_Income,next_profit_before_tax,next_profit_after_tax,next_CNIS,next_EPS)
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
    depreciation_expense = report_date.find_all('tr')[7]
    next_depreciation_expense = depreciation_expense.find_all("td")[1].get_text().lstrip()#折舊費用
    Amortizations = report_date.find_all('tr')[8]
    next_Amortizations = Amortizations.find_all("td")[1].get_text().lstrip()#攤銷費用
    Cash_flows_from_operating_activities = report_date.find_all('tr')[42]
    next_Cash_flows_from_operating_activities = Cash_flows_from_operating_activities.find_all("td")[1].get_text().lstrip()#營業活動之現金流量
    Cash_provided_by_investing_activities = report_date.find_all('tr')[57]
    next_Cash_provided_by_investing_activities = Cash_provided_by_investing_activities.find_all("td")[1].get_text().lstrip()#投資活動之淨現金流入（流出）
    Cash_flow_from_finance_activites = report_date.find_all('tr')[72]
    next_Cash_flow_from_finance_activites = Cash_flow_from_finance_activites.find_all("td")[1].get_text().lstrip()#籌資活動之淨現金流入（流出）
    Capital_expenditure = report_date.find_all('tr')[48]
    next_Capital_expenditure = Capital_expenditure.find_all("td")[1].get_text().lstrip()#資本支出
    CashFlowStatement = (next_depreciation_expense,next_Amortizations,next_Cash_flows_from_operating_activities,next_Cash_provided_by_investing_activities,next_Cash_flow_from_finance_activites,next_Capital_expenditure)
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
            command = """INSERT INTO financial_report(財報季度,股票名稱,現金及約當現金,短期投資,應收帳款淨額,存貨,流動資產,長期投資,固定資產,總資產,短期借款,應付短期票據,應付帳款,流動負債,總負債,權益總額,營業收入,營業毛利,銷售費用,管理費用,研發費用,營業費用,營業利益,稅前淨利,稅後淨利,母公司業主淨利,每股盈餘,折舊費用,攤銷費用,營業活動之現金流量,投資活動之淨現金流,籌資活動之淨現金流,資本支出)VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            # 取得股票價格
            
            for financial_report in financial_reports:
                
                cursor.execute(command,(financial_report[0],financial_report[1],financial_report[2],financial_report[3],financial_report[4],financial_report[5],financial_report[6],financial_report[7],financial_report[8],financial_report[9],financial_report[10],financial_report[11],financial_report[12],financial_report[13],financial_report[14],financial_report[15],financial_report[16],financial_report[17],financial_report[18],financial_report[19],financial_report[20],financial_report[21],financial_report[22],financial_report[23],financial_report[24],financial_report[25],financial_report[26],financial_report[27],financial_report[28],financial_report[29],financial_report[30],financial_report[31],financial_report[32]))
                conn.commit()
            
    except Exception as ex:
        print(ex)
    
def stock_search():
    Financial_report = []
    stock_number = 2454
    stock_name = "聯發科"
    year = 109
    season = 1
    BalanceSheet = crawl_financial_report_BalanceSheetURL(stock_number,stock_name, year, season)
    ProfitAndLose = crawl_financial_report_ProfitAndLoseURL(stock_number, year, season)
    CashFlowStatement = crawl_financial_report_CashFlowStatementURL(stock_number, year, season)
    Total_Touple = BalanceSheet+ProfitAndLose+CashFlowStatement
    Financial_report.append(Total_Touple)
    financial_report_db(Financial_report)


stock_search()




