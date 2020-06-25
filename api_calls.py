from flask import Flask, jsonify, request
from feature_extraction import get_response
import json
from flask_cors import CORS

# initialize our Flask application
app= Flask(__name__)
CORS(app)

def make_json(response,query_comb):
    json_resp = {'response':response, 'query_comb':query_comb }
    return json.dumps(json_resp)
# a python dictionary

@app.route("/input", methods=["POST"])
def setName():
    if request.method=='POST':
        posted_data = request.get_json()
        data = posted_data['input']
        response,query_comb = get_response([data])
        json_resp = make_json(response,query_comb)
        # print(response)
        return json_resp

@app.route("/message", methods=["GET"])
def message():
    posted_data = request.get_json()
    name = posted_data['name']
    return jsonify(" Hope you are having a good time " +  name + "!!!")
#  main thread of execution to start the server
if __name__=='__main__':
    app.run(host = "0.0.0.0",port ="80")