#-*- coding:utf-8 -*-
'''
'''

from flask import Flask
app = Flask(__name__)

@app.route("/init_search")
def init_search():
	
    return "Hello World!"

if __name__ == "__main__":
    app.run()
