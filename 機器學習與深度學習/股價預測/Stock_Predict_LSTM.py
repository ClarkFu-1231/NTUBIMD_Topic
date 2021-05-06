import keras
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler #MinMaxScaler可以執行特徵標準化的正規畫
from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM

np.random.seed(10)#亂數種子

'''載入訓練集資料'''
df_train = pd.read_csv("GOOG_Stock_Price_Train.csv", index_col="Date", parse_dates=True)#匯入資料
X_train_set = df_train.iloc[:, 4:5].values #Adj Close欄位
sc = MinMaxScaler()#建立MinMasScaler物件 
X_train_set = sc.fit_transform(X_train_set)#呼叫fit_transform()函數執行特徵標準化的正規化

'''呼叫create_dataset()'''
def create_dataset(ds, look_back=1):
    X_data, Y_data = [], []
    for i in range(len(ds)-look_back):
        X_data.append(ds[i:(i+look_back),0])
        Y_data.append(ds[i+look_back, 0])        
    return np.array(X_data), np.array(Y_data)
look_back = 10 #前60天股價
X_train, Y_train = create_dataset(X_train_set, look_back)

'''產生X_train和train訓練資料集'''
X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))#張量(樣本數,時步,特徵)

'''訓練資料集形狀'''
print("X_train.shape: ", X_train.shape)
print("Y_train.shape: ", Y_train.shape)

'''定義LSTM模型的程式碼'''
model = Sequential()
model.add(LSTM(50, return_sequences=True, input_shape=(X_train.shape[1], 1)))
model.add(Dropout(0.2))
model.add(LSTM(50, return_sequences=True))
model.add(Dropout(0.2))
model.add(LSTM(50))
model.add(Dropout(0.2))
model.add(Dense(1))

'''編譯和訓練模型'''
model.compile(loss="mse", optimizer="adam")#優化器adam,損失函數mse
model.fit(X_train, Y_train, epochs=100, batch_size=32)#訓練週期100

df_test = pd.read_csv("GOOG_Stock_Price_Test.csv")
X_test_set = df_test.iloc[:,4:5].values
X_test, Y_test = create_dataset(X_test_set, look_back)
X_test = sc.transform(X_test)
X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))
X_test_pred = model.predict(X_test)
X_test_pred_price = sc.inverse_transform(X_test_pred)

import matplotlib.pyplot as plt
plt.plot(Y_test, color="red", label="Real Stock Price")
plt.plot(X_test_pred_price, color="blue", label="Predicted Stock Price")
plt.title("2021 Google Stock Price Prediction")
plt.xlabel("Time")
plt.ylabel("Google Time Price")
plt.legend()
plt.show()




