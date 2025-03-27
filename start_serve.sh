#!/bin/bash
export NVM_DIR="/home/ubuntu/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # Loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # Loads nvm bash_completion

# Define log files
LOG_DIR="/home/ubuntu/SRPC_FRONT_END_PRIVATE"
ACCESS_LOG="$LOG_DIR/access.log"
ERROR_LOG="$LOG_DIR/error.log"

# Ensure log directory exists
mkdir -p $LOG_DIR

# Now run serve, redirecting stdout and stderr to log files
/home/ubuntu/.nvm/versions/node/v21.6.1/bin/serve -s build -l 8080 >> $ACCESS_LOG 2>> $ERROR_LOG

