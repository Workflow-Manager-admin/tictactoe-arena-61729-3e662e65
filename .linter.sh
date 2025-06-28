#!/bin/bash
cd /home/kavia/workspace/code-generation/tictactoe-arena-61729-3e662e65/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

