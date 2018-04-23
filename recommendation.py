

import pymysql
import pandas as pd
import numpy as np
import sys,json
conn = pymysql.connect(host='localhost',user='root',password='1234',db='idoctor')
df = pd.read_sql("select * from review", conn)

matrix1 = df[['userid','payment','trust','visit','behaviour']]

matrix2 = df[['doctorid','f1','f2','f3','f4']]
m2 =df[['f1','f2','f3','f4']]


matrix2 = matrix2.transpose()


m1 =matrix1[['payment','trust','visit','behaviour']]
x=np.array(m1)

m3 = m2.transpose()
y=np.array(m3)

r = np.zeros((len(x),len(x)))


for i in range(len(x)):
   
   for j in range(len(y[0])):
    
       for k in range(len(y)):
           r[i][j] += x[i][k] * y[k][j]



w = df[['doctorid','userid']]


user = sys.stdin.readlines()
user = json.loads(user[0])

l=[]

for i in range(0,len(x)):
    if user ==w.userid.get_value(i):
        l.append(i)


rank=[]
for i in range(0,len(x)):
    rank.append(0)

for j in range(0,len(x)): 
    temp =0
    for k in range(0,len(l)):
        temp=temp+r[l[k]][j]
    rank[j]=temp
   


s= set()

for i in range(0,3):
    ind = rank.index(max(rank))
    s.add(w.doctorid.get_value(ind))
    rank[ind]=-1

for i in s:
    print(i,end=' ')