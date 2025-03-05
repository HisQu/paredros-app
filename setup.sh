#!/usr/bin/env sh

# this script is supposed to lay the foundation for the installer script which ships with our app


# create a virtual environment
python3 -m venv .venv/

# use it and install all requirements for paredros
source .venv/bin/activate
pip install -r requirements.txt

echo "Finished setting up"
