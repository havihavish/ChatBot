
from unique_features import *
import collections

def check_color(features,input):
    color_res = []
    for color in colors:
        if(color in input):

            color_res.append(color)
    features['color'] =len(color_res)
    return color_res

def check_company(features,input):
    comp_res = []
    for company in companies:
        if(company in input):
            comp_res.append(company)
    features['company'] = len(comp_res)
    return comp_res

def check_synonym(input,items,feature_cnt):
    for item in items:
        if(item in input):
            return True
    return False if feature_cnt ==0 else True

def prepare_response(input,features):
    response = "Sorry we dont have that product, please select among the following "
    flag = True
    if(check_synonym(input,color_synonyms,features['color']) and check_synonym(input,company_synonyms,features['company'])):
        if features['color'] == 0 and features['company'] != 0:
            response = "Sorry we dont have that color product,select among the following"
        elif features['color'] != 0 and features['company'] == 0:
            response = "Sorry we dont have that company product,select among the following"
        elif features['color'] != 0 and features['company'] != 0:
            response = "Here, is the product"
        else:
            response = " Sorry we dont have both the features you mentioned,please select other"
        return response
    elif(check_synonym(input,color_synonyms,features['color'])):
        if features['color'] !=0:
            response = "Please select the manufacturer"
        else:
            response = "Sorry we dont have that color product,select among the following"
        return response

    elif(check_synonym(input,company_synonyms,features['company'])):
        if(features['company'] != 0):
            response = "Please select the color "
        else:
            response = "Sorry we dont have that company product,select among the following"
        return response

    return response
def possible_queries(color_res,company_res):
    # print("hello")
    if (len(color_res)>0 and len(company_res)>0 ):
        res_comb = [[i, j] for i in color_res for j in company_res]
    elif(len(color_res)):
        return color_res
    else:
        return company_res
    return res_comb

inputs = [ "I need a black or blue MOEN",
           "I need a black Facet",
            "I need a black color Facet",
         "Do you have orange color Facet?",
         "Is there a delta manufacturer Facet",
         "I am looking for a delta company Facet",
         "Do you have black or blue Facet?",
         "I need a blue or black of AMERICAN STANDARD company"]
def get_response(inputs):

    for input in inputs:
        print("input: ",input)
        input = input.lower()
        features = collections.defaultdict(int)
        color_res = check_color(features,input)
        company_res = check_company(features,input)
        # print(color_res,company_res)
        pos_comb = possible_queries(color_res,company_res)
        print("possible queries: ",pos_comb)
        response = prepare_response(input,features)
        print("response:", response)
        print()
        return response,pos_comb

# print(get_response(inputs))

