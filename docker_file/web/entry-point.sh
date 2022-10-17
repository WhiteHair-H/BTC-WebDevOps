#!/bin/sh
cat >>conf/httpd.conf<<EOF
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
<VirtualHost *:80>
  ServerName 20.194.109.211
  ProxyPreserveHost On
  ProxyPass / http://172.17.0.3:8081/
  ProxyPassReverse / http://172.17.0.3:8081/
</VirtualHost>
EOF
/usr/local/apache2/bin/apachectl -D FOREGROUND
bin/apachectl restart
