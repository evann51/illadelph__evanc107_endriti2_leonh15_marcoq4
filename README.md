# 'D(witter)' by illadelph
### Members:
Evan Chan. Endrit Idrizi, Leon Huang, and Marco Quintero

## Project Description
D(witter) is a derivative of the popular social media platform X, formerly known as Twitter. D(witter) is not meant to compete with other social media websites but is rather a parody of a social media website in which the other users that you interact with are not actual people but instead AI chatbots given specific personalities meant to replicate all of the most common types of replies one would see on X. Users can create their own posts and reply to existing posts. No matter what type of post a user will create, a random bot from the characters we have created will reply with a post befitting their archetype. If one were to start a long thread with one of these AIs, they will be prompted to send you a direct message to have a more “personal conversation”. 


## Install Guide
**SSH**: In your computer's ```Terminal/Powershell/Command Prompt```, run the command ```$   git clone git@github.com:evann51/illadelph__evanc107_endriti2_leonh15_marcoq4.git``` in the directory you want this file to be in.

## Launch Codes
**For Spinning 'D' Up on Local Host**  

1. **Making a Virtual Environment** (skip to Step 2 if a virtual environment with the required modules is already made and can be used)  
  a. In ```Terminal/Powershell/Command Prompt```, run ```$ python3 -m venv [name]``` or ```$ py -m venv [name]``` on Windows.  
  b. Then after the virtual environment is made, activate it with ```$ . [name]/bin/activate``` or ```$ . [name]/Scripts/activate``` on Windows. The virtual environment has been activated if you can see the name of it within parentheses at the beginning of the command line.  
  c. Install the Flask module by navigating to this project's directory and running ```$ pip install -r requirements.txt```.
  d. Deactivate the virtual environment with ```$ deactivate```.
3. **Running the Web App on Local Host**  
  a. Activate the virtual environment.
  b. Move into the app folder with ```$ cd app```.
  b. Run the flask app using ```$ python3 __init__.py``` or ```$ py __init__.py``` for Windows.  
  c. Enter ```http://127.0.0.1:5000``` in your web browser to access the web app.

### Feature Spotlight

### Known Bugs/Issues
