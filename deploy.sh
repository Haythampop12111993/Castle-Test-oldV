#!/bin/bash

project_path=/Users/alibadr/Desktop/dev/fabrica/angular/jd-jebaal-algomhorya
all=false;
while getopts 'y' OPTION; do
  case "$OPTION" in
    y)
      all=true ;;
  esac
done

case "$1" in
    gud)
      system=gud;
      system_path=/home/guddev/www/system/;
      tmp_path=/root/tmp-system/gud;
      ;;
    jd)
      system=jd;
      system_path=/home/jdholdingeg/public_html/system/;
      tmp_path=/root/tmp-system/jd;
      ;;
    jebal)
      system=jebal;
      system_path=/home/jebalegypt/www/system;
      tmp_path=/root/tmp-system/jebal;
      ;;
    *)
      echo "uploadGUD < gud | jd | jebal >"
      exit 1;
      ;;
esac

if ! $all; then
read -p "Build $system (y/n)?" CONT
fi

if $all || [ "$CONT" = "y" ]; then
  export NVM_DIR=$HOME/.nvm;
  source $NVM_DIR/nvm.sh;

  nvm use 8.9
  cd $project_path
  npm run build:$system
   cd dist
  zip -r app.zip * .htaccess
  echo "app.zip Ready To Upload.";
else
  echo "not Builded";
fi

if ! $all; then
read -p "Upload $system (y/n)?" CONT
fi

if $all || [ "$CONT" = "y" ]; then
      ssh root@46.165.252.97 -p 22 "rm -rf $tmp_path/*"
      scp -r $project_path/dist/app.zip root@46.165.252.97:$tmp_path/
else
  echo "not uploaded";
fi

if ! $all; then
read -p "Move $system To Product(y/n)?" CONT
fi

if $all || [ "$CONT" = "y" ]; then
    ssh root@46.165.252.97 -p 22 "rm -rf $system_path/* $system_path/.htaccess"
    ssh root@46.165.252.97 -p 22 "unzip $tmp_path/app.zip -d $system_path/"

else
  echo "not uploaded";
fi