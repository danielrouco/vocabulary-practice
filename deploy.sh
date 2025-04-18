cp index.html style.css ..
mv script.js ..
git switch gh-pages
mv ../index.html ../style.css ../script.js .
git add index.html style.css script.js
git commit -m "Deploy"