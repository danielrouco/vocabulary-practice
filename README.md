# Vocabulary practice
A simple and intuitive web app to enhance your vocabulary. Create custom word lists, practice them, and track your progress!  
## Usage
### Create a list
After introducing the name of the list introduce the list of words with this format:
> word<sub>1</sub>: translation<sub>1</sub>, word<sub>2</sub>: translation<sub>2</sub>, .. , word<sub>n</sub>: translation<sub>n</sub>
### Practice a list
In the practice mode  press `Enter` to submit an answer and press `Enter` again to go to the next question.
### Create a list of your Errors 
When you finish practicing a list, if you press the `Add error list to your lists` button. You will create a normal list with the errors of that practice session.
### Edit a list
If you press the `Edit` button of a list you will be able to edit the name of the list and also the words.
> [!WARNING]
> If you edit a list you will lose all the values of the history graph because I assume that when you edit a list you create a different list so any values or scores about the old list don't make sense for the new list. **This will occur even if you change only the name**. 
### Data storage
> [!CAUTION]
> All the data (words lists and values for the history graph) is stored in the **Local storage** of the browser so it is highly recommended to have a backup of your lists. 

> [!TIP]
> If you want to preserve also the values necessary to draw a history graph and a more convenient way to safely store your data: you can search for the `data` key (all the data is stored here) and copy all the content to save it locally. So that if the **Local storage** has been deleted you can add the `data` key with the content that you copied and you will have again all your data. 
> To acces local storage easily: 
> 1. Open developer options (`Right click` and `Inspect`)
> 2. Go to `Application` and `Local storage`
> 3. There you will see a table with the `data` key. There you can copy the content or paste the content that you copied before.
> 4. If you refresh all the data should be updated
## Screenshots
![Preview1](https://github.com/robda20188/vocabulary-practice/assets/98611646/ec5e508b-5817-46b4-bbde-e4a50c009626)

![Preview2](https://github.com/robda20188/vocabulary-practice/assets/98611646/3c9c53c1-cc3f-4f14-a69e-d7b84cf1f8f7)

![Preview3](https://github.com/robda20188/vocabulary-practice/assets/98611646/f16ff88f-67b9-4037-b46c-bbe9fbaa36d4)
