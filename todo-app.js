(function () {
  let allCreatedCases = [];
  let listName = '';

  // создаем и возвращаем заголовок элемента
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  };

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'добавить дело';
    button.disabled = true;

    input.addEventListener('input', function() {
      if(input.value === '') {
        button.disabled = true;
      } else button.disabled = false;
    })

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    }
  };

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  };

  function createTodoItem(object = {}) {
    let item = document.createElement('li');
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // установим стили элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = object.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'удалить';

    if (object.done === true) {item.classList.add('list-group-item-success')};

      doneButton.addEventListener('click', function () {
        item.classList.toggle('list-group-item-success');

        const currentName = object.id;
        console.log(currentName)
        for (let list of allCreatedCases) {
             if(list.id === currentName) {
                list.done = !list.done;
             }
        };

        saveList(allCreatedCases, listName);

      });
      deleteButton.addEventListener('click', function () {
        if (confirm('вы уверены?')) {
          item.remove();

          const currentName = object.id;

          for (let i = 0; i < allCreatedCases.length; i++) {
            if (allCreatedCases[i].id == currentName) {
              allCreatedCases.splice(i, 1)
            };
          }
        };

        saveList(allCreatedCases, listName);

      });

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    allCreatedCases.push(object);

    return {
      item,
      doneButton,
      deleteButton
    }

  };

  function createId(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id
    };

    return max +1;
  };


  function saveList(array, keyName) {
    localStorage.setItem(keyName, JSON.stringify(array))
    };

  function createTodoApp(container, title = 'список дел', keyName) {

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    listName = keyName;

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem(listName);

    if (localData !== null && localData !== '')  allCreatedCases = JSON.parse(localData);

    for (let itemList of allCreatedCases) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }

    // браузер создает событие submit на форме по нажатию на enter или создание дела
    todoItemForm.form.addEventListener('submit', function (e) {
      // эта строчка необходима, чтобы предотвратить стандартное действие браузера
      // в данном случаем мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      };


      let object = {
        id: createId(allCreatedCases),
        name: todoItemForm.input.value,
        done: false,
    };

    saveList(allCreatedCases, listName);

    let todoItem = createTodoItem(object)

      // создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      todoItemForm.button.disabled = true;
      // обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = '';

    })
  };

  window.createTodoApp = createTodoApp;

})();
