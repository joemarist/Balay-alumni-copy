# Balay-Alumni-Management-System
A web-based reservation and café management platform for USeP Balay Alumni.

# DEV NOTE: 
    This system uses php 8.3 - 8.4 if you have php 8.2 or lower i advice to update it. 
    copy the files in the php 8.3 or 4 and paste it in the php folder, \xampp\php
    then make sure to find the ';extension=zip' erase the ';' 
    
    Then make sure that the [Laravel Herd] is using 8.4 
    next is the step to install dependencies: 
    - composer install
    - npm install
    
    [if the composer wont install, it needs to be update, use 'composer update']

    to copy env [cp env.environment .env] 
    then make sure to uncomment the db below.
    next is the db, if you want to try and QA that shi
    use 'sqlite', but make sure to change back to mysql.

    - php artisan key: generate
    - php artisan migrate
        [if youre using sqlite, its much easier because you wont open xampp 
        it will pop up in the terminal]

    - npm run dev

    then try to click the link of the Laravel Herd in the Sites
    CONGRATS NIGGA you opened the site
    if you cant do it, SKILL ISSUE 