#connecting to remote and building castle
#references: https://github.com/laravel/envoy/blob/17fba7c57f31b57a1670bb62b3021bf85cc5c11c/src/RemoteProcessor.php
#this doesn't work in windows yet.
#in line 6, add the path to to your staging.pem file after the   i
echo Deploying Castle to staging
ssh -i ~/.ssh/Staging.pem ubuntu@18.219.150.157 'bash -se' << \\EOF
sudo su -
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd /home/admin/web/staging2.fabrica-dev.com/castle-development
git pull
nvm use 12
npm i
ng build --aot=false --prod --environment=staging --base-href https://staging2.fabrica-dev.com/castle/
cd dist
cp -r . /home/admin/web/staging2.fabrica-dev.com/public_html/castle
EOF

