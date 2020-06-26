# -*- coding: utf-8 -*-
"""DataClean_winsupply
"""

import pandas as pd

df = pd.read_csv('winsupply.csv')
print(df.head())

def split_color(row):
  lst = row.split(',')
  # print(len(lst),lst)
  if(len(lst)>1):
    color = lst[-1]
  else:
    color = None
  print(color)
  return color
df['Color'] = df['Product name'].apply(split_color)

df.head()

def split_product(row):
  lst = row.split(',')
  # print(len(lst),lst)
  if(len(lst)>1):
    product = ','.join(lst[:-1])
  else:
    product = lst[-1]
  print(product)
  return product
df['Product name'] = df['Product name'].apply(split_product)

df.head()
df = df.drop('Weight',axis =1)

df.to_csv('dataclean_winsupply.csv')

