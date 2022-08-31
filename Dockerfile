FROM ubuntu:latest
MAINTAINER luckypig3400
# https://ithelp.ithome.com.tw/articles/10191016

# SET WORKDIR for all RUN script: https://docs.docker.com/engine/reference/builder/#workdir
WORKDIR /home/

# https://askubuntu.com/questions/720784/how-to-install-latest-node-inside-a-docker-container
RUN apt-get update
RUN apt-get install curl -y
# https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash
RUN apt-get install nodejs -y
RUN node -v
RUN npm -v

# https://linuxize.com/post/how-to-install-git-on-ubuntu-18-04/
RUN apt install git -y
RUN git --version

# https://github.com/Lorex/FHIR-Universal-Conversion-Kit
RUN git clone https://github.com/Lorex/FHIR-Universal-Conversion-Kit.git

# Fix npm ERR:  https://ithelp.ithome.com.tw/articles/10204227
RUN cd FHIR-Universal-Conversion-Kit/src && npm install

RUN cd FHIR-Universal-Conversion-Kit && chmod +x ./start_server

CMD ["/home/FHIR-Universal-Conversion-Kit/start_server"]