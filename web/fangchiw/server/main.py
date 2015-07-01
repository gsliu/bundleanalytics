#-*- coding:utf-8 -*-
'''
'''
import ujson
import MySQLdb
from MySQLdb.cursors import DictCursor
from flask import Flask, jsonify
app = Flask(__name__)
app.debug = True

def gen_db_con(dict_cursor=False):
    if dict_cursor:
        con = MySQLdb.connect(host="10.117.8.206",port=3306,user="root",passwd="vmware",db="bigdata", cursorclass=DictCursor)
    else:
        con = MySQLdb.connect(host="10.117.8.206",port=3306,user="root",passwd="vmware",db="bigdata")
    return con

@app.route("/init_search")
def init_search():
    db_con = gen_db_con(dict_cursor=True)
    cur = db_con.cursor()
    cur.execute('select * from bugs')
    result = cur.fetchall()
    return ujson.dumps({'rawData': result})

if __name__ == "__main__":
    app.run('0.0.0.0')
