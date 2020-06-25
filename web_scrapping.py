from bs4 import BeautifulSoup
import pandas as pd
import requests
from functools import reduce
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
import time
from time import sleep
from selenium.webdriver.support.wait import WebDriverWait
from urllib.parse import urlparse

chrome_options = ChromeOptions()
chrome_options.add_argument("--headless")
driver = webdriver.Chrome("C:/webdrivers/chromedriver.exe",options = chrome_options)
wait = WebDriverWait(driver, 10)
my_url = 'https://www.winsupplyinc.com/view-products/plumbing/bathroom/bathroom-faucets/_/N-18e4a93'
driver.get(my_url)
#for i in range(1,100):
#driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
time.sleep(4)
html = driver.page_source
#res = driver.execute_script("return document.documentElement.outerHTML")
driver.quit()

soup = BeautifulSoup(html, "html.parser")

main_url = 'https://www.winsupplyinc.com'

def productname(bs,product):

    for div in bs.find_all(name="div",attrs={"class":"pd-details"}):
        for h in div.find_all(name="h1",attrs={"class":"pd-list_item--head win-h4"}):
            product.append(h.text)
    return product
def companyname(bs,company):

    for div in bs.find_all(name="div",attrs={"class":"pd-details"}):
        for span in div.find_all(name="span",attrs={"itemprop":"brand"}):
            for h in span.find_all(name="h2",attrs={"class":"pd-list_item--man"}):
                company.append(h.text)
    return company
def weight(bs,wght):
    for div in bs.find_all(name="div",attrs={"class":"pd-page_specs"}):
        for di in div.find_all(name="div",attrs={"class":"c-table c-table--striped"}):
            for d in di.find_all(name="div",attrs={"class":"c-table__row"}):
                for span in d.find_all(name="span",attrs={"class":"c-table__cell pd-page_table--key"}):
                    if(span.text=='Weight'):
                        for spn in d.find_all(name="span",attrs={"class":"c-table__cell pd-page_table--value"}):
                            wght.append(spn.text)
    return wght


def weblink(soup):
    weblinks = []
    newlinks = []

    for div in soup.find_all(name="div", attrs={"class": "pl-list_item--head"}):
        for links in div.find_all(name="a"):
            weblinks.append(links.get('href'))

    for wl in weblinks:
        newlinks.append((main_url + str(wl)))
    print(newlinks)
    product = []
    company = []
    wght = []
    for nl in newlinks:
        d=webdriver.Chrome("C:/webdrivers/chromedriver.exe",options = chrome_options)
        wait=WebDriverWait(d,10)
        d.get(nl)
        time.sleep(4)
        ml = d.page_source
        d.quit()
        bs=BeautifulSoup(ml,"html.parser")
        product = productname(bs,product)
        company = companyname(bs,company)
        wght = weight(bs,wght)


    return product,company,wght
web=weblink(soup)

zippedList=list(zip(web[0],web[1],web[2]))
dfObj=pd.DataFrame(zippedList,columns=['Product name','Company','Weight'])
print(dfObj, sep='\n')

ex=pd.DataFrame(dfObj).to_csv('winsupply.csv',header=True,index=None)





