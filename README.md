# bundleanalytics


Hadoop

1. setup hdfs

2. create directory in hdfs as support bundles.

Data preprocessing

1. mount bugzilla attachment nfs share
    bugs.eng.vmware.com:/ifs/sjc-bugs/bugs 
2. Input should be PR numbers, then we scan the bugzilla directory for support bundle files.

3. Support bundle file is extracted using python gzip lib. sample code.

	import gzip
	f = gzip.open('file.txt.gz', 'rb')
	file_content = f.read()
	f.close()

4. append the file we need to hdfs.

some other things need to consider???
ignore the duplicate support bundle.

5. for esxi host, A id number is added as the tag at the head of each line.
   <id>:aaaaaa
6. for virtual machine, A host id and virtual machine id is added.
   <id>:<vmid>:aaaaaaa

7. two relation database tables are used to store the information of host id and vm id.
   +----------+-----------------------+-----------------------------+
| host id  |     bugzilla id       |      host name              |
+----------------------------------------------------------------+
|          |                       |                             |
|          |                       |                             |
+----------+-----------------------+-----------------------------+
                                                                  
                                                                  
+-----------+---------------------+-------------------------+     
|  vm id    |     host id         |       vm name           |     
+-----------------------------------------------------------+     
|           |                     |                         |     
|           |                     |                         |     
+-----------+---------------------+-------------------------+     


UI data Input

 Data Input, range of PR numbers? 1111-19999


UI Qurey Input:

1. Congfiguration query?
   
    file: /etc/vmware/config
    configuration: vhv.enabled

2. log query:
    
    file: /var/log/vmkernel.log
    log pattern: "error xxxx"

UI Query result display

configuration query
1. PIE chart 

2. BAR chart

log query

For esxi host display

 host namme |  bugzilla id | occurance times

For vm display

 vm name | host name | occurance times




