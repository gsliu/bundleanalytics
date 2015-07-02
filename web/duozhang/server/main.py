#-*- coding:utf-8 -*-
'''
'''
import ujson
import MySQLdb
from MySQLdb.cursors import DictCursor
from flask import Flask, jsonify
app = Flask(__name__)
app.debug = True
from get_search_result import *
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
@app.route("/init_search_orig")
@crossdomain(origin='*')
def init_search_orig():
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

    for i in range(0, len(result) ):
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

    for i in range(0, len(result) ):
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

    for i in range(0, len(result)):
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

def categorize_vcpu(vcpu):
    vcpu_default = [2, 4, 6, 8]
    if vcpu not in vcpu_default:
        vcpu = 'other'
    else:
        vcpu = str(vcpu)
    return 'vcpu '+str(vcpu)

def categorize_disksize(size):
    size = size/1024
    if size == 0:
        res = 0
    elif size <= 40:
        res = '<=40'
    elif 40 < size <=100:
        res = '40~100'
    elif 100< size < 200:
        res = '100~200'
    else:
        res = ">200"
    return 'disk '+str(res)+'G'


def categorize_memsize(size):
    if size <= 2048:
        res = '<=2048'
    elif 3000 < size < 7000:
        res = '4096'
    elif 7000 < size < 15000:
        res = '8192'
    elif size <= 17000:
        res = '16384'
    else:
        res = 'other'
    return 'mem '+str(res)

def categorize_hardwareversion(number):
    version = ''
    if number == 7:
        version = '7'
    elif number == 8:
        version = '8'
    elif number == 9:
        version = '9'
    elif number == 10:
        version = '10'
    else:
        version == 'other'
    return 'hwversion ' + str(version)

def categorize_i(i):
    item = dict()
    for key in i.keys():
        if key == 'vcpu':
            item[key] = categorize_vcpu(i[key])
        elif key == 'disksize':
            item[key] = categorize_disksize(i[key])
        elif key == 'memsize':
            item[key] = categorize_memsize(i[key])
        elif key == 'hardwareversion':
            item[key] = categorize_hardwareversion(i[key])
        elif key == 'count':
            item[key] = i[key]
    return item


global_sequence = {
                    'vcpu':['vcpu', 'memsize', 'disksize', 'hardwareversion'],
                    'memsize':['memsize', 'vcpu', 'disksize', 'hardwareversion'],
                    'disksize':['disksize', 'vcpu', 'memsize', 'hardwareversion'],
                    'hardwareversion':['hardwareversion', 'vcpu', 'memsize', 'disksize']

                  }

def get_result(arg):
    db_con = gen_db_con(dict_cursor=True)
    cur = db_con.cursor()
    seq = global_sequence[arg]
    sql = '''SELECT %s, %s, %s, %s, COUNT(*) as count 
             FROM  `vmdetailinfo` 
             GROUP BY 1 , 2, 3, 4
          ''' %(seq[0], seq[1], seq[2], seq[3])
    cur.execute(sql)
    result = cur.fetchall()
    real_result = []
    for i in result:
        i = categorize_i(i)
        step = '-'.join([str(i[seq[0]]), str(i[seq[1]]), str(i[seq[2]]), str(i[seq[3]])])
        count = i['count']
        real_result.append([step, count])
    
    dict_result = dict()
    for i in real_result:
        try:
            dict_result[i[0]] += i[1]
        except:
            dict_result[i[0]] = i[1]

    list_result = list()
    for key in dict_result.keys():
        list_result.append([key, dict_result[key]])

    return ujson.dumps({'rawData': list_result})

   

# @app.route("/init_search")
# @crossdomain(origin='*')
# def init_search():
#     return get_result('vcpu')


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
    cur.execute('select bug_id, creation_ts, keywords, short_desc  from bugs')
    all_bugs = cur.fetchall()

    cur.execute('select min(creation_ts) min, max(creation_ts) max from bugs')
    min_max = cur.fetchall()[0]
    min_ct = min_max['min']
    max_ct = min_max['max']

    return ujson.dumps({'rawData': all_bugs, 'minCt': min_ct, 'maxCt': max_ct})


if __name__ == "__main__":
    app.run('0.0.0.0')

