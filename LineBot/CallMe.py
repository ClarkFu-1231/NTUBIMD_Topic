# -*- coding: utf-8 -*-
"""
Created on Thu Apr  8 19:05:41 2021

@author: HAO
"""
#sys用於取得輸入資料
#json用於轉換資料格式
#request用於連線
import sys 
import json
import requests
coid = sys.argv[1]
try:
  url='https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym='+coid+'&v=1&callback='
  #yahoo股市的API
  r=requests.get(url)
  str1=r.text[1:-2]#擷取json段落
  dict1=eval(json.dumps(eval(str1)))#轉為json格式
  O=dict1['ta'][-1]['o']#開盤價
  H=dict1['ta'][-1]['h']#最高價
  L=dict1['ta'][-1]['l']#最低價
  C=dict1['ta'][-1]['c']#收盤價
  V=dict1['ta'][-1]['v']#成交量
  T=dict1['ta'][-1]['t']#日期
  coName=dict1['mem']['name']#公司名稱
  out={1:"查詢公司：%s \n最近一收盤日：%d \n收盤價：%.2f元 \n成交量：%d張"%(coName,T,C,V)}
except:
  # out={1:'查無資料請確認是否輸入正確代號'}
  try:
    host_ip='https://c393-180-217-227-99.ngrok.io'
    url='https://fubon-ebrokerdj.fbs.com.tw/z/zc/zc0/zc08/ZC08GIF_1102_1080_720.djgif'
    r=requests.get(url)
    f = open('./public/img%d.jpg'%(1),'wb')
    f.write(r.content)
    f.close()
    out={2:host_ip+'/img1.jpg'}
  except:
    out={1:'查無資料請確認是否輸入正確代號'}
'''
tp內容:
    text        00000001:1
    image       00000010:2
    video       00000100:4
    sticker     00001000:8
    audio       00010000:16
    location    00100000:32
    imagemap    01000000:64
    template    10000000:128
未來可以用or讓type交互搭配
'''
typeDict={'text'    :0b1,
          'image'   :0b10,
          'video'   :0b100,
          'sticker' :0b1000,
          'audio'   :0b10000,
          'location':0b100000,
          'imagemap':0b1000000,
          'template':0b10000000}
tp=int(typeDict['text'])
result = {
	#sys.argv[0]為檔案名稱
	#sys.argv[1]為輸入資料
	#sys.argv[n]看有幾筆輸入資料就到多少
    "Type":tp,
    "Result":out
    #"url":url
  }
#將result(dict)轉為json格式
json = json.dumps(result)
#以字串型式回傳資料
print(str(json))
sys.stdout.flush()