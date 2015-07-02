from datetime import datetime
from elasticsearch import Elasticsearch
from os import listdir
from os.path import isfile, join

class Bundleanalytics_Log_Loader:

    def __init__(self, log_file):
        self.es = Elasticsearch()
        self.index = 'vmw'
        self.doc_type = 'vmw'
        self.log_file = log_file 
        self.create_index()
    
    def create_index(self): 
        doc = {
            'mappings':{
        
                self.doc_type:{
                    "_source" : {"enabled" : "false"}
                } 
            }
        }
        res = self.es.indices.create(index = self.index, body = doc)
        return res    

    def index_item(self, bundle_id, text):
        print "XXXXXXX"
        print bundle_id
        print text
        doc = {
            'text': text, 
        }
        res = self.es.index(index = self.index, doc_type = self.doc_type, id = bundle_id, body = doc)
        return res['created']

    def index_all(self):
        bundle_id = -1
        text = ""
        #FIXME the last one is ignore, -1 is add	
        with open(self.log_file) as f:
            for line in f:
                ret = line.split(':', 1)
                cur_id = int(ret[0])
                if bundle_id == cur_id:
                    text += ret[1]
                else:
                    if bundle_id != -1:
                        text = unicode(text, errors='replace') 
                        self.index_item(bundle_id, text)
                    text = ret[1]
                bundle_id = cur_id
        if bundle_id != -1:
            text = unicode(text, errors='replace') 
            self.index_item(bundle_id, text)
 
if __name__ == "__main__":
    import sys
    print len(sys.argv)
    if len(sys.argv) < 2:
        print "Please provide two log filename"
        exit(0)
    
    loader = Bundleanalytics_Log_Loader(sys.argv[1])
 
    print loader.index_all()
