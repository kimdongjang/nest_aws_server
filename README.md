# nest_aws_server

## MicroService Test 구조

service-client-nest: 5682  
mq-server-nest: 5672

`localhost:5682/hello/john`접근 -> 5682 컨트롤러에서 5672의 컨트롤러로 전달, 5672의 서비스 실행

## AWS Docker, Jenkins 도커 자동배포 구조

### ec2가 메인 호스트

1. 젠킨스 컨테이너 구동
2. 젠킨스에서 웹훅, 파이프라인 스크립트로 프로젝트 빌드
3. 빌드된 이미지 sock/volume을 통해 ec2 메인 호스트 도커 이미지에 공유(실제로는 젠킨스 컨테이너에서 생성되지만 sock과 볼륨으로 이미지가 공유됨)
4. doocker compose 호출으로 ec2 메인 호스트에서 이미지 run
5. 결과 : 메인 호스트 컨테이너에 젠킨스, 프로젝트 컨테이너가 구동

### 포트 정보

nest-server : 4949  
react-client : 4900(80)  
next-server : 3000

# SMTP 설정파일

## .env

```
EMAIL_AUTH_EMAIL=naru3644@gmail.com
EMAIL_AUTH_PASSWORD=패스워드
EMAIL_HOST=smtp.gmail.com
EMAIL_FROM_USER_NAME=naru3644
```
