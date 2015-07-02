#-*- coding:utf-8 -*-
'''
'''
import ujson
import MySQLdb
from MySQLdb.cursors import DictCursor
from flask import Flask, jsonify
app = Flask(__name__)
app.debug = True
import get_search_res
from datetime import timedelta
from flask import make_response, request, current_app
from functools import update_wrapper

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers
            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            h['Access-Control-Allow-Credentials'] = 'true'
            h['Access-Control-Allow-Headers'] = \
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

def gen_db_con(dict_cursor=False):
    if dict_cursor:
        con = MySQLdb.connect(host="10.117.8.206",port=3306,user="root",passwd="vmware",db="bigdata", cursorclass=DictCursor)
    else:
        con = MySQLdb.connect(host="10.117.8.206",port=3306,user="root",passwd="vmware",db="bigdata")
    return con
@app.route("/init_search")
@crossdomain(origin='*')
def init_search():
    db_con = gen_db_con(dict_cursor=True)
    cur = db_con.cursor()
    cur.execute('select * from bugs')
    result = cur.fetchall()
    return ujson.dumps({'rawData': result})

@app.route("/hostcpuinfo")
@crossdomain(origin='*')
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
@crossdomain(origin='*')
def hostmeminfo():
    db_con = gen_db_con(dict_cursor=True)
    cur = db_con.cursor()
    cur.execute('select * from hostmeminfo order by memsize')
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
@crossdomain(origin='*')
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

@app.route("/escalation")
@crossdomain(origin='*')
def escalation():
    db_con = gen_db_con(dict_cursor=True)
    cur = db_con.cursor()
    cur.execute('select * from escalation')
    result = cur.fetchall()

    pr = []
    for i in range(0, len(result) - 1):
	pr.append(result[i]['pr'])
    return ujson.dumps({'escalation': tuple(pr)})


@app.route("/vmmcore")
@crossdomain(origin='*')
def vmmcore():
    result = ([1410564, 1406873, 1401845, 1401124, 1394165, 1392460])
    return ujson.dumps({'vmmcore': result})

@app.route("/vmxcore")
@crossdomain(origin='*')
def vmxcore():
    result = ([1390036, 1401374, 1401895, 1402825, 1403598, 1405216, 1406350, 140716])
    return ujson.dumps({'vmxcore': result})

@app.route("/vmotion")
@crossdomain(origin='*')
def vmotion():
    result = ([1402825, 1392805, 1394070, 1396916, 1398622, 1399322, 1400515])
    return ujson.dumps({'vmotion': result})

@app.route("/search")
@crossdomain(origin='*')
def query():
    return get_search_res(request.args['q'])


if __name__ == "__main__":
    app.run('0.0.0.0')

