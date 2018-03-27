# Introduction 
The purpose of this project is to set up a Students rank mini app using raw ES6 with REACT components for the UI. The aim is to learn as much as possible about REACT and how to build a componed based architecture web app. We focus the development in broad unit and end to end (e2e) testing

# Prerequisites
npm and node should be installed on your system
recommended npm version 3.5.0 or greater 
recommended node version 4.2.5 or greater 

# First time we clone or download the project 
Install dependencies and modules used for development purposes
<pre>nmp install </pre>
We wait until node_modules folder has been filled with all development modules needed for our app

# For continous development 

<pre>npm run-script dev</pre>

Other interesting npm scripts  
 
<pre>npm run-script build </pre>
Creates dist/ folder with all files optimized for production

Take a look at package.json scripts
<pre>npm run-script test</pre> Launching unit tests
<pre>npm run-script e2e-test</pre> Launching e2e tests with protractor



# For production deployment
Start node server with forever <pre>npm start</pre>
Stop node server <pre>npm stop</pre>

We should start too with forever src/server/hook.js a special server listening on port 8888 push notifications in github.com on master branch.
The main goal of this web hook is execute src/server/scripts/deploy.sh to perform the next actions:
<pre>
 cd /home/pedcremo/StudentsRank
git checkout master
git pull origin master
npm install
npm stop
npm start
</pre>
Thanks to this webhook we achieve continuos integration and forget about manual deployments. We should be very carefull on not publish something unstable on master branch.
We must pass all testings before be tempted to command 'git push origin master'

In order to enable this webhook it is mandatory to proceed with some configurations on github.com project settings. Specifically webhooks section. Add webhook. Set content type to application/json. Check Active. Enable just the push event and put the same shared-secret than in our src/server/hook.js listener. 

RECOMMENDED READING:
http://blog.karmadust.com/automatic-node-js-deployments-on-a-linux-server-via-github/

#docker. We want to create a container for our app

1. Install docker
2. docker run node:latest node --version //Try to find docker containers with latest node and npm packages installed
3. docker run -d -p 8000:8000 -v $(pwd):/src -w /src node:latest npm start
4. ckeck if running docker ps

Save docker container into a file -> docker save -o {path_dest_tar} {name_image} 
Ex. docker save -o /tmp/runking gifted_goldberg
Load docker container -> docker load -i runking.tar 
READ: getting started with docker blogs.msdn.microsoft.com

# Apache2 + node app living in same server serving https 
READ http://www.codingtricks.biz/run-nodejs-application-apache/

We want to use a VPS with a preexisting web app running on port 80 in apache2.
Our server side is built using nodeJS and we want to serve the web app via https.

Domain http://moodle.iestacio.com points to preexisting web a moodle system with php

Domain http://runking.bocairent.net  points to a web app with nodeJS running on port 8000
We use apache module proxy to redirect requests pointing to runking.bocairent.net:80 to localhost:8000 where it is really listening our node app

We enable the next apache modules:

sudo a2enmod proxy.load
sudo a2enmod proxy_html.load
sudo a2enmod xml2enc.load
sudo a2enmod ssl.load

sudo a2ensite runking.conf

NOTE: Be sure to add in https.conf  Listen 443. Otherwise apache service will not open the port to serve https web pages.

We should generate our valid certificate and keys using Let's encrypt service a project from Linux foundation (https://letsencrypt.org/)

READ CAREFULLY HOW TO GENERATE CERTIFICATES: https://certbot.eff.org/#ubuntuxenial-apache

Try to do it from a server with a public IP an a domain name pointing to it. The domain name is mandatory for building the certificate.

sudo certbot --apache certonly
sudo certbot --authenticator standalone --installer apache  -d runking.iestacio.com --pre-hook "service apache2 stop" --post-hook "service apache2 start"

He editat /etc/hosts per fer que runking.iestacio.com cap a 127.0.0.1
Google api console to change redirect 
runking.conf file content
<pre>
NameVirtualHost *:80
<VirtualHost *:80>
	ServerName runking.bocairent.net
        DocumentRoot "/var/www/node"
        Redirect / https://runking.bocairent.net
        #ProxyRequests off
        #ProxyPass  / https://127.0.0.1:8000/
        #ProxyPassReverse / https://127.0.0.1:8000/
</VirtualHost>
<VirtualHost *:443>
	ServerName runking.bocairent.net
        DocumentRoot "/var/www/node"
	SSLEngine on
	SSLCertificateFile /etc/letsencrypt/live/runking.bocairent.net/cert.pem
	SSLCertificateKeyFile /etc/letsencrypt/live/runking.bocairent.net/privkey.pem
	SSLCertificateChainFile /etc/letsencrypt/live/runking.bocairent.net/fullchain.pem
        SSLProxyEngine on 
	ProxyRequests off
        ProxyPass  / https://runking.bocairent.net:8000/
        ProxyPassReverse / https://runking.bocairent.net:8000/
</VirtualHost>

</pre>

# Test workflow 
http://busypeoples.github.io/post/testing-workflow-with-es6/