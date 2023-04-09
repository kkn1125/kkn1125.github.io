---
slug: "/replication01/"
layout: post
modified: 2023-04-08 16:57:33 +0000
date: 2022-11-06 17:52:32 +0000
title: "[MYSQL] 로컬에서 Replication 설정하기"
author: Kimson
categories: [mysql]
image: /images/post/covers/TIL-mysql.png
tags: [sql, rdbms, replication, local, wsl]
description: "Replication 이란

mysql에서 지원하는 replication이란 복제를 의미합니다. 2대 이상의 DBMS를 나눠서 데이터를 저장하는데요, Master와 Slave라는 개념으로 구성됩니다.

Master는 write기능을 가진 DBMS이고, Slave는 only read의 기능을 가지는 DBMS입니다. 양방향으로 Master-Slave 관계를 가지게 해서 서로 저장하는 백업 서버로 구성할 수 도 있습니다.

사용의 목적은 실시간 Dat 백업과 여러 대의 DB서버의 부하를 분산시킬 수 있다는 것에 있습니다. Insert, Update, Delete와 같은 수정 쿼리를 Master Server에서 처리하고, 처리된 Data를 Slave Server에 전달합니다. 만일 Select 쿼리까지 감당한다면 부하가 심할 때 무리가 있으니 필요에 따라 여러 대의 Slave Server로 복제하여 부하를 분산 할 수 있습니다.

Replication을 설정하는데 몇가지 주의점과 자주보는 에러상황이 있는데요, 설정 방법과 함께 알아보겠습니다."
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

## WSL에 접근 가능하도록 설정하기

로컬에서 WLS로 접근하게 하는 방법은 간단합니다. 우선 어떠한 문제가 있고 왜 그냥 사용하지 못하는지 알고 시작하는게 좋겠지요.

WSL은 고정 IP가 아닌 유동 IP로 동작됩니다. 재부팅하게 되면 어제 두드리던 내 집 문이 남의 집 문이 되어버리는 느낌입니다.

먼저 IP를 고정해줘야하는 이슈가 발생합니다. 일회성으로 Command Line을 통해 설정 할 수 있고, 배치파일을 생성해서 작업 스케줄러에 등록하고 컴퓨터가 시작 될 때마다 실행되도록 할 수 있습니다. 필자는 후자를 택했습니다. 일회성으로 일일히 하기 번거롭기 때문이죠.

### IP 추가

고정 IP를 할당해야하는데요, 앞서 해야할 것은 wsl의 버전 명을 알아내는 것 입니다.

```bash
# window
$ wsl -l
# wsl
$ wsl.exe -l


C:\Users\pc-name>wsl -l
Linux용 Windows 하위 시스템 배포:
docker-desktop
Ubuntu-22.04
docker-desktop-data
```

위 커멘드를 실행하면 명칭이 나오는데 저는 Ubunt-22.04입니다. 실행하기 편하도록 루트 경로에 배치파일을 작성합니다.

```bash
$ touch ~/static-ip.bat

wsl.exe -d Ubuntu-22.04 -u root ip addr add 192.168.254.17/24 broadcast 192.168.50.255 dev eth0 label eth0:1
```

위 명령줄로 ip를 추가합니다. add 옆에오는 ip가 고정 ip로 사용할 주소입니다. 저는 사용하는 컴퓨터에서 사용하지 않는 네트워크 대역과 호스트를 주었습니다. 앞의 xxx.xxx.xxx가 네트워크, 그 뒤에 xxx가 호스트입니다.

그리고 broadcast에 다른 네트워크 대역을 주고 호스트를 255로 줍니다. 자세한 내용은 잘 모르지만 255로 설정하면 해당 네트워크 대역을 리슨하는 것으로 알고 있습니다. 그리고 eth0에 eth0:1를 만들어 추가한다는 의미로 해석하고 있습니다.

다음으로 wsl에 로컬의 IP주소를 추가합니다.

```bash
$ netsh interface ip add address "vEthernet (WSL)" 192.168.254.100 255.255.255.0
```

이 부분 또한 자세한 내용은 모르지만 이해하기로는 같은 네트워크 대역으로 리슨하는 설정으로 알고 있습니다.

> 잘못된 내용을 지적바랍니다. 즉시 수정하겠습니다.

### 작업 스케줄러 등록

배치파일이 완료되면 아래와 같습니다. 저장된 경로는 루트입니다.

```bat
wsl.exe -d Ubuntu-22.04 -u root ip addr add 192.168.254.17/24 broadcast 192.168.50.255 dev eth0 label eth0:1
netsh interface ip add address "vEthernet (WSL)" 192.168.254.100 255.255.255.0
```

작업 스케줄러를 실행하고 `작업 스케줄러 라이브러리` 디렉토리를 우클릭하여 폴더를 생성합니다. 이름은 알기 편한 것으로 하면 됩니다. 저는 `ws-static-ip`로 했습니다.

그리고 만들어진 폴더를 우클릭하고 `작업 만들기`를 클릭합니다. 이름은 `wsl static ip boot`이라고 했습니다.

그리고 `사용자가 로그온할 때만 실행`과 `가장 높은 수준의 권한으로 실행`에 체크합니다. 트리거 탭으로 이동해서 `새로 만들기`를 클릭합니다.

작업 시작은 `로그온할 때`로 하고 사용자 설정을 합니다. 그 외는 손대지 않습니다. 동작 탭으로 넘어가 `새로 만들기`를 클릭합니다.

설정의 `프로그램/스크립트`에 찾아보기를 클릭해서 위에서 만든 bat파일을 선택해서 등록합니다. 마지막으로 컴퓨터를 재부팅합니다.

그리고 잘 설정이 되었는지 확인하고자 한다면 간단하게 ping 테스트를 합니다.

```bash
# local
$ ping -i 1 -c 1 192.168.254.17 # 아까 설정한 고정 IP
# wsl
$ ping -i 1 -c 1 192.168.xxx.xxx # 본인의 이더넷 ipv4
```

로컬에서 아까 설정한 고정 IP로 ping을 보내고 receive가 100%로 출력되면 성공입니다. 마찬가지로 wsl로 접근해서 자신의 이더넷 ipv4주소로 ping을 보냈을 때 receive가 100%라면 정상 연결된 것 입니다.

mysql을 설치해서 연결하고자 한다면 호스트와 포트번호 등을 기입해서 액세스해야합니다.

```bash
# local
$ mysql -u username -p -D test_db --host 192.168.254.17 --port 3306

# wsl
$ mysql -u username -p -D test_db --host 192.168.xxx.xxx --port 3306
```

한 가지 더 기록하자면 wsl에서 db를 개방하려면 설정이 몇 개 필요합니다.

1. UFW 방화벽 설정
2. my.conf의 bind-address를 주석처리 또는 0.0.0.0으로 처리 했는가
3. 외부에서 wsl db의 root계정에 접근하고자 할 때 계정 권한이 localhost인가
   1. localhost라면 '%' 또는 특정 ip를 지정해야합니다.

```bash
# 방화벽 설정
ufw enable
ufw allow 3306/tcp
```

여기까지 WSL에 고정 IP를 설정하고 DB서버를 개방하여 접근하는 방법과 Replication 기능을 사용하는 내용이었습니다.

> 잘못된 내용이 있다면 피드백 바랍니다.
