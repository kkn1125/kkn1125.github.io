---
slug: "/replication01/"
layout: post
date: 2022-11-06 17:52:32 +0900
title: "[MYSQL] 로컬에서 Replication 설정하기"
author: Kimson
categories: [mysql]
image: /images/post/covers/TIL-mysql.png
tags: [sql, rdbms, replication, local, wsl]
description: ""
featured: true
hidden: false
rating: 4.5
toc: true
profile: false
istop: true
keysum: false
keywords: ""
published: true
---

# Replication 이란

mysql에서 지원하는 replication이란 복제를 의미합니다. 2대 이상의 DBMS를 나눠서 데이터를 저장하는데요, Master와 Slave라는 개념으로 구성됩니다.

Master는 write기능을 가진 DBMS이고, Slave는 only read의 기능을 가지는 DBMS입니다. 양방향으로 Master-Slave 관계를 가지게 해서 서로 저장하는 백업 서버로 구성할 수 도 있습니다.

사용의 목적은 실시간 Dat 백업과 여러 대의 DB서버의 부하를 분산시킬 수 있다는 것에 있습니다. Insert, Update, Delete와 같은 수정 쿼리를 Master Server에서 처리하고, 처리된 Data를 Slave Server에 전달합니다. 만일 Select 쿼리까지 감당한다면 부하가 심할 때 무리가 있으니 필요에 따라 여러 대의 Slave Server로 복제하여 부하를 분산 할 수 있습니다.

Replication을 설정하는데 몇가지 주의점과 자주보는 에러상황이 있는데요, 설정 방법과 함께 알아보겠습니다.

## 주의사항

1. 마스터와 슬레이브 서버 중 버전이 동일하지 않다면 슬레이브서버가 상위 버전이어야 합니다.
2. 마스터 -> 슬레이브 순으로 서버를 실행해야 합니다.
3. ping테스트와 route를 확인하면서 제대로 연결 되었는지 확인해야 합니다.
4. wsl에 마스터/슬레이브를 두고자 한다면 ip설정 등이 필요합니다.

## Replication 설정

### Master Server Settings

먼저 마스터서버에서 설정하는 방법입니다.

```ini
[mysqld]
log-bin=mysql-bin
server-id=1
```

server-id의 값은 마스터를 1로 설정하는 것이 좋습니다. 다른 넘버도 되지만 헷갈리지 않고 사용하려면 1로 설정하는 것이 좋습니다.

mysql을 root권한으로 접속합니다.

```mysql
CREATE DATABASE slave DEFAULT CHARACTER SET utf8;
CREATE USER 'slave'@'%' IDENTIFIED BY '123';
GRANT ALL PRIVILEGES ON 'slave'.* TO 'slave'@'%' IDENTIFIED BY '123';
GRANT REPLICATION SLAVE ON *.* TO 'slave'@'%' IDENTIFIED BY '123';
FLUSH PRIVILEGES; -- 꼭 해줍시다.

FLUSH TABLES WITH READ LOCK; -- 모든 테이블 모든 레코드에 변경 잠금

-- 커멘드라인을 사용한다면 아래와 같이
SHOW MASTER STATUS\G;
-- workbench를 사용한다면 아래와 같이
SHOW MASTER STATUS;
```

이렇게 입력하면 마스터의 로그 빈과 position값이 나옵니다. 해당 값 두 가지는 어딘가에 메모해둡니다. 나중에 슬레이브 서버에서 사용할 것이기 때문입니다. 설정이 끝났으면 아래와 같이 mysql 서비스를 재시작합니다.

```bash
# window는 아래와 같이
$ net stop mysql
$ net start mysql
# linux는 아래와 같이
$ sudo service mysql restart
```

mysql서비스가 등록되어 있지 않다면 mysql이 설치된 디렉토리의 bin폴더에 가서 커멘드라인으로 서비스를 등록해야합니다.

```bash
mysqld --install
```

> 정상 등록이 된다면 `Service successfully installed.`라는 메세지가 출력됩니다.

모든 세팅이 끝났다면 slave라는 데이터베이스를 덤프로 내보내기해야합니다.

```bash
$ mysqldump -u root -p -B slave > dump.sql
# column-statistics 에러가 발생한다면
$ mysqldump -u root -p -B slave --column-statistics=0 > dump.sql
```

### Slave Server Settings

필자는 Slave Server를 WSL에서 사용할 것이기 때문에 WSL 기준으로 포스팅하겠습니다.

WSL을 설치합니다. 설치 방법은 마이크로소프트 앱에서 간편하게 설치할 수 있기 때문에 과정은 생략하겠습니다.

사용하는 버전은 Ubuntu 22.04.1입니다.

```bash
$ sudo apt update
$ sudo apt install mysql-server mysql-client
```

서버와 클라이언트를 설치받습니다. 윈도우 로컬에서 접근하는 방법과 외부에서 WSL에 접근하는 방법은 나중에 다루도록 하고 기본 설정하는 것부터 시작하겠습니다.

먼저 서버 설정을 하겠습니다. /etc/mysql/mysql.conf.d/50-server.conf를 열어 내용을 수정합니다.

```conf
[mysqld]
# bind-address=127.0.0.1
bind-address=0.0.0.0
# 또는 주석처리합니다. (이후 외부 접근 위함. 필요없으면 안해도 됩니다.)
log-bin=mysql-bin
server-id=2
```

설정이 끝났다면 저장하여 종료하고, db를 재시작합니다. Master Server설정 마지막에 내보낸 덤프를 WSL에 가져와 import하겠습니다.

```bash
$ mysql -u root -p < ~/dump.sql
```

정상적으로 import됐다면 mysql에 접속했을 때 slave 데이터베이스가 있어야합니다.

```mysql
SHOW DATABASES;
-- 있으면 다음으로
STOP SLAVE;
RESET SLAVE;
CHANGE MASTER TO
	MASTER_HOST='xxx.xxx.xxx.xxx', -- localhost는 안먹힙니다. 이걸로 3시간 삽질을...
	MASTER_PORT=3306,
	MASTER_DATABASE='slave'
	MASTER_USER='slave',
	MASTER_PASSWORD='123',
	MASTER_LOG_FILE='mysql-bin.000001',
	MASTER_LOG_POS=328;
START SLAVE;
```

위의 설정 중 LOG_FILE과 LOG_POS는 Master Server 설정에서 메모했던 파일과 포지션 값입니다. 이제 연결이 되었으니 상태를 확인해서 정상 연결이 되었는지 확인해야합니다.

```mysql
SHOW SLAVE STATUS\G;
# 또는
SHOW SLAVE STATUS;
```

연결이 잘 되었다면 아래와 같은 로그가 출력됩니다.

```bash
*************************** 1. row ***************************
                Slave_IO_State: Waiting for master to send event
                   Master_Host: xxx.xxx.xxx.xxx
                   Master_User: slave
                   Master_Port: 3306
                 Connect_Retry: 60
               Master_Log_File: mysql-bin.000001
           Read_Master_Log_Pos: 966
                Relay_Log_File: mysqld-relay-bin.000002
                 Relay_Log_Pos: 555
         Relay_Master_Log_File: mysql-bin.000001
              Slave_IO_Running: Yes # 여기
             Slave_SQL_Running: Yes # 여기
               Replicate_Do_DB: 
           Replicate_Ignore_DB: 
            Replicate_Do_Table: 
        Replicate_Ignore_Table: 
       Replicate_Wild_Do_Table: 
   Replicate_Wild_Ignore_Table: 
                    Last_Errno: 0
                    Last_Error: 
                  Skip_Counter: 0
           Exec_Master_Log_Pos: 966
               Relay_Log_Space: 865
               Until_Condition: None
                Until_Log_File: 
                 Until_Log_Pos: 0
            Master_SSL_Allowed: No
            Master_SSL_CA_File: 
            Master_SSL_CA_Path: 
               Master_SSL_Cert: 
             Master_SSL_Cipher: 
                Master_SSL_Key: 
         Seconds_Behind_Master: 0
 Master_SSL_Verify_Server_Cert: No
                 Last_IO_Errno: 0
                 Last_IO_Error: 
                Last_SQL_Errno: 0
                Last_SQL_Error: 
   Replicate_Ignore_Server_Ids: 
              Master_Server_Id: 1
                Master_SSL_Crl: 
            Master_SSL_Crlpath: 
                    Using_Gtid: No
                   Gtid_IO_Pos: 
       Replicate_Do_Domain_Ids: 
   Replicate_Ignore_Domain_Ids: 
                 Parallel_Mode: optimistic
                     SQL_Delay: 0
           SQL_Remaining_Delay: NULL
       Slave_SQL_Running_State: Slave has read all relay log; waiting for more updates
              Slave_DDL_Groups: 0
Slave_Non_Transactional_Groups: 0
    Slave_Transactional_Groups: 0
```

연결이 잘 되지 않았다면 아래와 같이 Slave_IO_Running이 Connecting으로 나타날 것입니다.

```bash
*************************** 1. row ***************************
                Slave_IO_State: Connecting to master
                   Master_Host: localhost
                   Master_User: slave
                   Master_Port: 3306
                 Connect_Retry: 60
               Master_Log_File: mysql-bin.000001
           Read_Master_Log_Pos: 328
                Relay_Log_File: mysqld-relay-bin.000001
                 Relay_Log_Pos: 4
         Relay_Master_Log_File: mysql-bin.000001
              Slave_IO_Running: Connecting # 이게 문제
             Slave_SQL_Running: Yes
               Replicate_Do_DB: 
           Replicate_Ignore_DB: 
            Replicate_Do_Table: 
        Replicate_Ignore_Table: 
       Replicate_Wild_Do_Table: 
   Replicate_Wild_Ignore_Table: 
                    Last_Errno: 0
                    Last_Error: 
                  Skip_Counter: 0
           Exec_Master_Log_Pos: 328
               Relay_Log_Space: 256
               Until_Condition: None
                Until_Log_File: 
                 Until_Log_Pos: 0
            Master_SSL_Allowed: No
            Master_SSL_CA_File: 
            Master_SSL_CA_Path: 
               Master_SSL_Cert: 
             Master_SSL_Cipher: 
                Master_SSL_Key: 
         Seconds_Behind_Master: NULL
 Master_SSL_Verify_Server_Cert: No
                 Last_IO_Errno: 2003
                 Last_IO_Error: error connecting to master 'slave@localhost:3306' - retry-time: 60  maximum-retries: 100000  message: Can't connect to server on 'localhost' (111 "Connection refused")
                Last_SQL_Errno: 0
                Last_SQL_Error: 
   Replicate_Ignore_Server_Ids: 
              Master_Server_Id: 0
                Master_SSL_Crl: 
            Master_SSL_Crlpath: 
                    Using_Gtid: No
                   Gtid_IO_Pos: 
       Replicate_Do_Domain_Ids: 
   Replicate_Ignore_Domain_Ids: 
                 Parallel_Mode: optimistic
                     SQL_Delay: 0
           SQL_Remaining_Delay: NULL
       Slave_SQL_Running_State: Slave has read all relay log; waiting for more updates
              Slave_DDL_Groups: 0
Slave_Non_Transactional_Groups: 0
    Slave_Transactional_Groups: 0
```

Slave에서 로그를 보면 마스터 서버의 업데이트 정보를 기다린다는 문구가 출력될 것이고, 마스터 측에서는 슬레이브와 정상 연결되었다는 문구가 출력될 것입니다.

마스터 서버에서 테이블을 생성하거나 레코드 데이터를 넣고, 슬레이브 서버에서 조회했을 때 동기화 된다면 연결 성공입니다.

만일, 양방향으로 데이터가 저장되는 것을 목표로 한다면 이 과정을 Slave - Master 반대로 설정하면 됩니다.

즉, Slave에서 설정했던 stop, reset, change master to, start slave 설정을 Master Server에서 하면 됩니다.

해당 결과를 미리 말씀드리자면, 어느 한 쪽의 DB의 서비스가 종료시점에 다른 DB가 데이터를 수정, 변경한다면 종료된 DB를 재시작했을 때 확인하여도 동일한 데이터가 동기화되는 것을 확인 할 수 있습니다.

> WSL에 로컬 및 외부 접근 허용하는 방법은 다음 포스팅에 정리하겠습니다. 시간이 늦은 관계로...