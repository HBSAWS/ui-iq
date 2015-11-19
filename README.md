# HUVER HBS Admin App

##Installation Prerequisites
**1. Install Node.js** 
<br>
[Node can be installed via the node installer](http://sass-lang.com/install) **recomended**<br>
[As well as via the Homebrew package manager](http://brew.sh/)<br>
You can install the Homebrew package manger via your terminal with the following:
```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

And then install node by typing :
```
brew install node
```

**2. Install ruby Sass** 
<br>
SASS can be installed by running the following command : <br>
<i>Used for compiling SASS in gulp</i><br>
```
sudo su -c "gem install sass"
```

[Additional info on installing SASS](http://sass-lang.com/install)



##Installing the App
**1. Download the repo to your machine.**

**2. In your terminal CD into the repo.**

**3. Install the node packages first with :**
```
npm install
```

**4. Then install the App with :**
```
gulp install
```



##Running the App
**1. In the project folder start the mock API by running:***
```
gulp start-API
```

**2. To start the task management, open a new window in your terminal and point it to the project directory again.  Type :**
```
gulp
```
The APP should open the browser window for you once it's finished compiling.  If it doesn't simply open your desired browser and type :
> [http://localhost:5010/static/](http://localhost:5010/static/)

The task management creates a proxy to the express App that you started up by turning on the API.  Task mangement gives you:

1. Automatic compiling of SASS, javascript and HTML when you save a file in the 'src' directory that ends with '.scss','js' or 'html'

2. After compiling the browser will automatically reload to show you the changes.

3. An external link anyone on the same network be sent to view the project.  The local URL and external URL are given to you in your terminal when you run the 'gulp' prompt.