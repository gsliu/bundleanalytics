#!/usr/bin/python

import os
import sys
import tarfile
import re
import MySQLdb
from subprocess import *
import json
from sets import Set

bz_config = {
    'host': '10.117.8.206',
    'port': 3306,
    'user': 'root',
    'passwd': 'vmware',
    'db': 'bigdata'
}

def mysql_con(config, cur_class=None):
    con = MySQLdb.connect(**config)
    cur = con.cursor(cur_class)
    return con, cur

def get_bz_con(cur_class=None):
    return mysql_con(bz_config, cur_class)

def host2pr(hostid):
    bz_con, bz_cur = get_bz_con()
    sql = 'select pr from hostinfo where hostid=%d' %(hostid)
    bz_cur.execute(sql)
    item = bz_cur.fetchall()
    assert(len(item) == 1)
    return item[0][0]

def vm2pr(vmid):
    bz_con, bz_cur = get_bz_con()
    sql = 'select pr from hostinfo,vminfo where hostinfo.hostid=vminfo.hostid and vmid=%d' %(vmid)
    bz_cur.execute(sql)
    item = bz_cur.fetchall()
    assert(len(item) == 1)
    return item[0][0]

def get_host_search_res(query):
    ans = []
    search_dsl = '{"query":{"match":{"text":"%s"}}}' %(query)
    es_url = "http://cybertron.eng.vmware.com:9200/vmk/vmk/_search"
    child = Popen(["curl",es_url, "-d", search_dsl], stdout=PIPE)
    json_res = child.communicate(None)[0]
    jres = json.loads(json_res)
    for item in jres['hits']['hits']:
        ans.append(host2pr(int(item['_id']))) 
    return list(Set(ans))

def get_vm_search_res(query):
    ans = []
    search_dsl = '{"query":{"match":{"text":"%s"}}}' %(query)
    es_url = "http://cybertron.eng.vmware.com:9200/vmw/vmw/_search"
    child = Popen(["curl", es_url, "-d", search_dsl], stdout=PIPE)
    json_res = child.communicate(None)[0]
    jres = json.loads(json_res)
    for item in jres['hits']['hits']:
        ans.append(vm2pr(int(item['_id']))) 
    return list(Set(ans))

def get_search_res(query):
    ans = {}
    s = Set(get_host_search_res(query))
    for x in get_vm_search_res(query):
        s.add(x)
    ans['hits'] = list(s) 
    return json.dumps(ans)  
 
if __name__ == "__main__":
    print host2pr(1000583)
    print vm2pr(508821)
    print get_host_search_res("migrate")
    print get_vm_search_res("migrate")
    print get_search_res("migrate")
