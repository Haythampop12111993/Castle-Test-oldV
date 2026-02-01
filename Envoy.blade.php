* This is castle frontend staging deploy script
* Before you start to use the script please do the following steps
* 1. Navigate to your .ssh folder on your local machine | windows : C:\Users\USERNAME\.ssh , linux /home/USERNAME/.ssh
* 2. create a new file with name "config" and add the following
* Host 18.219.150.157
*   IdentityFile PATH_TO_Staging.pem_FILE
*   User ubuntu
*
* Example run: $ envoy run deploy_staging

@servers(['staging' => 'ubuntu@18.219.150.157'])

@story('deploy_staging')
git-pull
@endstory
@task('git-pull')
sudo su -
cd /home/admin/web/staging2.fabrica-dev.com/castle-development
git pull
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
nvm use 12
npm i
ng build --aot=false --prod --environment=staging --base-href https://staging2.fabrica-dev.com/castle/
cd dist
cp -r . /home/admin/web/staging2.fabrica-dev.com/public_html/castle
@endtask
