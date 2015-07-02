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

@app.route("/hostcpuinfo")
def hostcpuinfo():
    db_con = gen_db_con(dict_cursor=True)
    cur = db_con.cursor()
    cur.execute('select * from hostcpuinfo')
    result = cur.fetchall()

    pie = []
    x = []
    y = []

    for i in range(0, len(result) - 1):
    	temp = {}
   	temp['name'] = result[i]['cpunumber']
   	temp['value'] = result[i]['count']
   	pie.append(temp)
   	x.append(result[i]['cpunumber'])
   	y.append(result[i]['count'])
	
    return ujson.dumps({'pie': tuple(pie), 'bar':(x,y)})


@app.route("/hostmeminfo")
def hostmeminfo():
    db_con = gen_db_con(dict_cursor=True)
    cur = db_con.cursor()
    cur.execute('select * from hostmeminfo')
    result = cur.fetchall()

    pie = []
    x = []
    y = []

    for i in range(0, len(result) - 1):
    	temp = {}
   	temp['name'] = result[i]['memsize']
   	temp['value'] = result[i]['count']
   	pie.append(temp)
   	x.append(result[i]['memsize'])
   	y.append(result[i]['count'])
	
    return ujson.dumps({'pie': tuple(pie), 'bar':(x,y)})


@app.route("/hostversioninfo")
def hostversioninfo():
    db_con = gen_db_con(dict_cursor=True)
    cur = db_con.cursor()
    cur.execute('select * from hostversioninfo')
    result = cur.fetchall()

    pie = []
    x = []
    y = []

    for i in range(0, len(result) - 1):
    	temp = {}
   	temp['name'] = result[i]['hostversion']
   	temp['value'] = result[i]['count']
   	pie.append(temp)
   	x.append(result[i]['hostversion'])
   	y.append(result[i]['count'])
	
    return ujson.dumps({'pie': tuple(pie), 'bar':(x,y)})

if __name__ == "__main__":
    app.run('0.0.0.0')
