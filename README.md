# Vocabulary practice
A simple and intuitive web app to enhance your vocabulary. Create custom word lists, practice them, and track your progress!
## Usage
### Create a list
After introducing the name of the list introduce the list of words with this format:
> word<sub>1</sub>: translations<sub>1</sub>, word<sub>2</sub>: translations<sub>2</sub>, ... , word<sub>n</sub>: translations<sub>n</sub>

Where translations<sub>i</sub> is a '/' separated list of translations :
> translation<sub>i.1</sub> / translation<sub>i.2</sub> / ... / translation<sub>i.n</sub>
### Practice a list
In the practice mode  press `Enter` to submit an answer and press `Enter` again to go to the next question.
### Create a list of your Errors
When you finish practicing a list, if you press the `Add error list to your lists` button. You will create a normal list with the errors of that practice session.
### Edit a list
If you press the `Edit` button of a list you will be able to edit the name of the list and also the words.
> [!WARNING]
> If you edit a list you will lose all the values of the history graph because I assume that when a list is edited any values or scores about the old list don't make sense for the new list. **This will occur even if you change only the name**.
### Data storage
This web is serverless so you are responsible of storing your data locally. To do that click on the `Export all lists` button. Like that all the data including lists and the data necessary to draw a history graph will be downloaded.

To import back the data click on the `Import lists` button and select the file that you downloaded. However the data is also stored on the **Local storage** of the browser so probably the data will be there without having to import it.
> [!CAUTION]
> You should not rely only on localStorage because it can be deleted because of multiple reasons. Instead, you should export always your data when you finish practising

## Screenshots
![Preview1](https://github.com/robda20188/vocabulary-practice/assets/98611646/ec5e508b-5817-46b4-bbde-e4a50c009626)

![Preview2](https://github.com/robda20188/vocabulary-practice/assets/98611646/3c9c53c1-cc3f-4f14-a69e-d7b84cf1f8f7)

![Preview3](https://github.com/robda20188/vocabulary-practice/assets/98611646/f16ff88f-67b9-4037-b46c-bbe9fbaa36d4)
