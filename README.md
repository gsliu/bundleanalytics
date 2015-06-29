# bundleanalytics


Hadoop

1. setup hdfs

2. create directory in hdfs as support bundles.

[gliu@pek2-office-18th-10-117-174-219 esx-TPKVM01.TPK-SOLUTIONS.COM-2014-08-13--09.01]$ tree 
.
├── altbootbank
├── bootbank
├── commands
├── etc
│   ├── likewise
│   │   └── db
│   ├── opt
│   │   └── vmware
│   │       └── fdm
│   ├── rc.local.d
│   ├── vmsyslog.conf.d
│   └── vmware
│       ├── driver.map.d
│       ├── firewall
│       ├── hostd
│       │   └── env
│       ├── icu
│       ├── ike
│       │   └── default
│       ├── microcode
│       ├── rhttpproxy
│       ├── secpolicy
│       │   ├── domains
│       │   ├── fileLabels
│       │   ├── objects
│       │   └── tardisks
│       ├── service
│       ├── vmkiscsid
│       ├── vm-support
│       ├── vmwauth
│       ├── vpxa
│       └── weasel
├── json
├── proc
│   ├── bus
│   │   └── pci
│   │       ├── 00
│   │       ├── 01
│   │       ├── 02
│   │       ├── 03
│   │       ├── 04
│   │       ├── 05
│   │       └── 0e
│   ├── driver
│   │   └── hpsa
│   ├── net
│   │   └── nx_nic
│   │       ├── dev0
│   │       ├── dev1
│   │       ├── dev2
│   │       └── dev3
│   └── scsi
│       ├── hpsa
│       └── lpfc820
├── reconstruction
├── tmp
│   └── vmware-root
├── usr
│   ├── lib
│   │   └── vmware
│   │       └── licenses
│   │           └── site
│   └── share
│       └── hwdata
│           └── driver.pciids.d
├── var
│   ├── lib
│   │   └── vmware
│   │       └── hostd
│   │           └── stats
│   ├── log
│   └── run
│       └── log


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

PIE chart for percentage???





