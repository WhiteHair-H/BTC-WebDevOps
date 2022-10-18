#!/bin/sh
cat >>conf/httpd.conf<<EOF
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
<VirtualHost *:80>
  ServerName $ServerName
  ProxyPreserveHost On
  ProxyPass / http://$WasServer:8081/
  ProxyPassReverse / http://$WasServer:8081/
</VirtualHost>
EOF
/usr/local/apache2/bin/apachectl -D FOREGROUND
bin/apachectl restart
