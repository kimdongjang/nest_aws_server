# docker_nest_test

AWS Docker, Jenkins 도커 자동배포 구조

ec2가 메인 호스트고

1. 젠킨스 컨테이너 구동
2. 젠킨스에서 웹훅, 파이프라인 스크립트로 프로젝트 빌드
3. 빌드된 이미지 sock/volume을 통해 ec2 메인 호스트 도커 이미지에 공유(실제로는 젠킨스 컨테이너에서 생성되지만 sock과 볼륨으로 이미지가 공유됨)
4. doocker compose 호출으로 ec2 메인 호스트에서 이미지 run
5. 결과 : 메인 호스트 컨테이너에 젠킨스, 프로젝트 컨테이너가 구동

포트 정보
nest-server : 4939
react-client : 4900(80)

빌드 테스트 중1
