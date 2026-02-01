#!/bin/bash

# Yes To All
y_all=false;
while getopts 'y' OPTION; do
  case "$OPTION" in
    y)
      y_all=true ;;
  esac
done


function prompt_for_multiselect {

    # little helpers for terminal print control and key input
    ESC=$( printf "\033")
    cursor_blink_on()   { printf "$ESC[?25h"; }
    cursor_blink_off()  { printf "$ESC[?25l"; }
    cursor_to()         { printf "$ESC[$1;${2:-1}H"; }
    print_inactive()    { printf "$2   $1 "; }
    print_active()      { printf "$2  $ESC[7m $1 $ESC[27m"; }
    get_cursor_row()    { IFS=';' read -sdR -p $'\E[6n' ROW COL; echo ${ROW#*[}; }
    key_input()         {
      local key
      IFS= read -rsn1 key 2>/dev/null >&2
      if [[ $key = ""      ]]; then echo enter; fi;
      if [[ $key = $'\x20' ]]; then echo space; fi;
      if [[ $key = $'\x1b' ]]; then
        read -rsn2 key
        if [[ $key = [A ]]; then echo up;    fi;
        if [[ $key = [B ]]; then echo down;  fi;
      fi 
    }
    toggle_option()    {
      local arr_name=$1
      eval "local arr=(\"\${${arr_name}[@]}\")"
      local option=$2
      if [[ ${arr[option]} == true ]]; then
        arr[option]=
      else
        arr[option]=true
      fi
      eval $arr_name='("${arr[@]}")'
    }

    local retval=$1
    local options
    local defaults

    IFS=';' read -r -a options <<< "$2"
    if [[ -z $3 ]]; then
      defaults=()
    else
      IFS=';' read -r -a defaults <<< "$3"
    fi
    local selected=()

    for ((i=0; i<${#options[@]}; i++)); do
      selected+=("${defaults[i]:-false}")
      printf "\n"
    done

    # determine current screen position for overwriting the options
    local lastrow=`get_cursor_row`
    local startrow=$(($lastrow - ${#options[@]}))

    # ensure cursor and input echoing back on upon a ctrl+c during read -s
    trap "cursor_blink_on; stty echo; printf '\n'; exit" 2
    cursor_blink_off

    local active=0
    while true; do
        # print options by overwriting the last lines
        local idx=0
        for option in "${options[@]}"; do
            local prefix="[ ]"
            if [[ ${selected[idx]} == true ]]; then
              prefix="[x]"
            fi

            cursor_to $(($startrow + $idx))
            if [ $idx -eq $active ]; then
                print_active "$option" "$prefix"
            else
                print_inactive "$option" "$prefix"
            fi
            ((idx++))
        done

        # user key control
        case `key_input` in
            space)  toggle_option selected $active;;
            enter)  break;;
            up)     ((active--));
                    if [ $active -lt 0 ]; then active=$((${#options[@]} - 1)); fi;;
            down)   ((active++));
                    if [ $active -ge ${#options[@]} ]; then active=0; fi;;
        esac
    done

    # cursor position back to normal
    cursor_to $lastrow
    printf "\n"
    cursor_blink_on

    eval $retval='("${selected[@]}")'
}

# Functions 

print_system_header(){
    msgcolor=`echo "\033[01;31m"`
    normal=`echo "\033[00;00m"`
    printf "${msgcolor}Upload ${system_name}${normal}\n"
}

checkCond() {
    if $y_all; then
        return 1;
    fi

    read -p "$1 (y/N)?" CONT

    if [ "$CONT" = "y" ] || [ "$CONT" = "Y" ];
    then
        return 1;
    else
        return 0;
    fi
}

# pipeline staging functions
buildSystem() {
    if checkCond "Build $system_name" == 0; then
        echo "Skip Build";
        return;
    fi
    if $node8; then
        # load nvm
        export NVM_DIR=$HOME/.nvm;
        source $NVM_DIR/nvm.sh;
        nvm use 8.9
    fi

    cd $project_path
    npm run $build_script

    cd $dist

    zip -r $system_name.zip * .htaccess

    echo "$system_name.zip Ready To Upload.";
}

uploadSystem() {
    if checkCond "Upload $system_name.zip" == 0; then
        echo "Skip Upload";
        return;
    fi

    ssh $server "rm -f $tmp_path/$system_name.zip"
    scp -r $project_path/$dist/$system_name.zip $server:$tmp_path/
}

moveSystemOnServer() {
    if checkCond "Move $system_name To Product" == 0; then
        echo "Skip Move";
        return;
    fi

    ssh $server "rm -rf $system_path/* $system_path/.htaccess"

    ssh $server "unzip $tmp_path/$system_name.zip -d $system_path/"
}

start_upload_system() {
    # Header
    clear
    print_system_header

    # pipeline
    buildSystem
    uploadSystem
    moveSystemOnServer
}

# Main Program
clear

OPTIONS_VALUES=("alqamzi" "alqamzi-staging" "equity" "equity-staging" "cred-staging" "gud" "jd" "jebal" "jd-staging" "humhum-admin-staging" "humhum-admin-prod" "humhum-supplier-staging" "humhum-supplier-prod" "jestate")

for i in "${!OPTIONS_VALUES[@]}"; do
	OPTIONS_STRING+="${OPTIONS_VALUES[$i]};"
done

prompt_for_multiselect SELECTED "$OPTIONS_STRING"

for i in "${!SELECTED[@]}"; do
	if [ "${SELECTED[$i]}" == "true" ]; then
		opt="${OPTIONS_VALUES[$i]}"
        echo $opt
        skip_remove=false;
        case $opt in
            alqamzi)
                system_name=alqamzi;
                # local
                project_path=/home/sayed/Desktop/projects/alqamzi;
                build_script=build:live;
                dist=dist;

                # server
                server=root@vmi1010815.contaboserver.net;
                system_path=/var/www/vhosts/alqamzi.com/system.alqamzi.com;
                tmp_path=/root/tmp-system;
                node8=true;
                start_upload_system;
                ;;
            alqamzi-staging)
                system_name=alqamzi-staging;
                # local
                project_path=/home/sayed/Desktop/projects/alqamzi;
                build_script=build:staging;
                dist=dist;

                # server
                server=root@46.165.236.121;
                system_path=/var/www/vhosts/st.fabrica.com.eg/alqamzi.st.fabrica.com.eg;
                tmp_path=/root/tmp-system;
                node8=true;
                start_upload_system;
                ;;
            equity)
                system_name=equity;
                # local
                project_path=/home/sayed/Desktop/projects/equity-frontend;
                build_script=build:live;
                dist=dist;

                # server
                server=root@46.165.222.12;
                system_path=/var/www/vhosts/equity.com.eg/system.equity.com.eg;
                tmp_path=/home/tmp-upload-system;
                node8=true;
                start_upload_system;
                ;;
            equity-staging)
                system_name=equity-staging;
                # local
                project_path=/home/sayed/Desktop/projects/equity-frontend;
                build_script=build:staging;
                dist=dist;

                # server
                server=root@46.165.236.121;
                system_path=/var/www/vhosts/st.fabrica.com.eg/ww.st.fabrica.com.eg;
                tmp_path=/root/tmp-system;
                node8=true;
                start_upload_system;
                ;;
            cred-staging)
                system_name=cred-staging;
                # local
                project_path=/home/sayed/Desktop/projects/castle-development;
                build_script=build:staging;
                dist=dist;

                # server
                server=root@46.165.236.121;
                system_path=/var/www/vhosts/st.fabrica.com.eg/cred.st.fabrica.com.eg;
                tmp_path=/root/tmp-system;
                node8=true;
                start_upload_system;
                ;;
            gud|jd|jebal)
                # local
                project_path=/home/sayed/Desktop/projects/jd-jebaal-algomhorya;
                dist=dist;

                # server
                server=root@46.165.252.97;
                tmp_path=/root/tmp-system/$system_name;

                case "$opt" in
                    gud)
                        system_name=gud;
                        system_path=/home/guddev/www/system;
                        ;;
                    jd)
                        system_name=jd;
                        system_path=/home/jdholdingeg/public_html/system;
                        ;;
                    jebal)
                        system_name=jebal;
                        system_path=/home/jebalegy/public_html/system;
                        ;;
                    *)
                    echo $errorMSG;
                    exit 1;
                    ;;
                esac

                build_script=build:$system_name;
                node8=true;
                start_upload_system;
                ;;
            jd-staging)
                system_name=jd-staging;
                # local
                project_path=/Users/alibadr/Desktop/dev/fabrica/angular/jd-jebaal-algomhorya;
                build_script=build:jd:staging;
                dist=dist;

                # server
                server=root@46.165.236.121;
                system_path=/var/www/vhosts/st.fabrica.com.eg/jd.st.fabrica.com.eg;
                tmp_path=/root/tmp-system;
                node8=true;
                start_upload_system;
                ;;
            humhum-admin-staging)
                system_name=humhum-admin-staging;
                # local
                project_path=/home/sayed/Desktop/projects/hum-hum-admin-portal;
                build_script=build:staging;
                dist=dist/humhum-admin-portal;
                # server
                server=root@46.165.236.121;
                system_path=/var/www/vhosts/st.humhum.work/dashboard.st.humhum.work;
                tmp_path=/root/tmp-system;
                node8=false;
                start_upload_system;
                ;;
            humhum-admin-prod)
                system_name=humhum-admin-prod;
                # local
                project_path=/home/sayed/Desktop/projects/hum-hum-admin-portal;
                build_script=build:live;
                dist=dist/humhum-admin-portal;
                # server
                server=ubuntu@18.219.227.31;
                system_path=/var/www/html/dashboard;
                tmp_path=/home/ubuntu/tmp-upload-system;
                node8=false;
                start_upload_system;
                ;;
            humhum-supplier-staging)
                system_name=humhum-supplier-staging;
                # local
                project_path=/home/sayed/Desktop/projects/hum-hum-supplier-portal;
                build_script=build:staging;
                dist=dist/humhum-supplier-portal;
                # server
                server=root@46.165.236.121;
                system_path=/var/www/vhosts/st.humhum.work/supplier.st.humhum.work;
                tmp_path=/root/tmp-system;
                node8=false;
                start_upload_system;
                ;;
            humhum-supplier-prod)
                system_name=humhum-supplier-prod;
                # local
                project_path=/home/sayed/Desktop/projects/hum-hum-supplier-portal;
                build_script=build:live;
                dist=dist/humhum-supplier-portal;
                # server
                server=ubuntu@18.219.227.31;
                system_path=/var/www/html/supplier;
                tmp_path=/home/ubuntu/tmp-upload-system;
                node8=false;
                start_upload_system;
                ;;
            jestate)
                system_name=jestate;
                # local
                project_path=/home/sayed/Desktop/projects/g-state;
                build_script=build;
                dist=dist;

                # server
                server=root@pprls.net;
                system_path=/home/jestate/public_html/system;
                tmp_path=/root/tmp-system;
                node8=true;
                start_upload_system;
                ;;
        esac
	fi
done