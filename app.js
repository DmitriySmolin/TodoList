const tasks = [{
    _id: '5d2ca9e2e03d40b326596aa7',
    completed: true,
    body: 'Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n',
    title: 'Eu ea incididunt sunt consectetur fugiat non.',
  },
  {
    _id: '5d2ca9e29c8a94095c1288e0',
    completed: false,
    body: 'Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n',
    title: 'Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum.',
  },
  {
    _id: '5d2ca9e2e03d40b3232496aa7',
    completed: true,
    body: 'Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n',
    title: 'Eu ea incididunt sunt consectetur fugiat non.',
  },
  {
    _id: '5d2ca9e29c8a94095564788e0',
    completed: false,
    body: 'Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n',
    title: 'Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum.',
  },
];

//самовызывающаяся ф-ция позволяет скрыть переменные от глобальной области, защитив от переопределения
(function (arrOfTasks) {
  //console.log(arrOfTasks.length)
  //формируем объект объектов, где ключами являются id, а значениями вложенные объекты
  const objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {})
  console.log(objOfTasks);

  //Elements UI
  const listCotainer = document.querySelector('.tasks-list-section .list-group');

  const form = document.forms['addTask'];
  const inputTitle = form.elements['title'];
  const inputBody = form.elements['body'];
  //console.log(inputTitle, inputBody);

  //ф-ция создает buttons:showAllTasks, showUnfinishedTasks
  (function createButton() {
    const showAllTasks = document.createElement('button');
    showAllTasks.textContent = 'showAllTasks';
    showAllTasks.classList.add('btn', 'btn-info');

    const showUnfinishedTasks = document.createElement('button');
    showUnfinishedTasks.textContent = 'showUnfinishedTasks';
    showUnfinishedTasks.classList.add('btn', 'btn-warning');

    document.querySelector('.btn-group').append(showAllTasks);
    document.querySelector('.btn-group ').append(showUnfinishedTasks);
  }());

  //Events
  renderAllTasks(objOfTasks);
  form.addEventListener('submit', onFormSubmitHandler);
  //поскольку список задач генерируется динамически мы не можем именно на кнопки навесить, поэтому обработчик события был повешен на родительский элемент и за счет делегирования мы получаем доступ к кнопкам
  listCotainer.addEventListener('click', onDeleteHandler);
  listCotainer.addEventListener('click', onPerformTask);

  const btnShowUnfinishedTasks = document.querySelector('.btn-warning');
  btnShowUnfinishedTasks.addEventListener('click', showUnfinishedTasks);

  const btnshowAllTasks = document.querySelector('.btn-info');
  btnshowAllTasks.addEventListener('click', showAllTasks);


  //ф-ция создает fragment и добавляет fragment в listContainer
  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.error('Передайте список задач!');
      return;
    };

    const fragment = document.createDocumentFragment(); //для оптимизация работы DOM, сначала все добавляем во fragment
    //console.log(fragment);

    Object.values(tasksList).forEach(task => { //сортируем элементы tasklist
      const li = listItemTemplate(task); //создаем li и вызываем ф-цию listItemTeplate и передаем в нее с каждой итерации task, которая вовзращает шаблон li элемента
      fragment.append(li);
    });
    listCotainer.append(fragment);

  };

  //ф-ция выводит все незавершенные  задачи
  function showUnfinishedTasks() {
    const completeTasks = onPerformTask() || objOfTasks;

    const isComplete = Object.keys(completeTasks).filter(task => completeTasks[task].completed);
    isComplete.forEach(id => {
      document.querySelector(`li[data-task-id="${id}"]`).classList.add('hidden');
    })
  };

  //ф-ция выводит все задачи
  function showAllTasks() {
    document.querySelectorAll('.list-group-item').forEach(el => el.classList.remove('hidden'));
  };

  //ф-ция создает шаблон li элемента
  function listItemTemplate({
    _id,
    title,
    body
  } = {}) {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'align-items-center', 'flex-wrap', 'mt-2');
    li.setAttribute('data-task-id', _id); //добавялем каждому li _id для того чтобы потом определить какой конкретно элемент мы хотим удалить  из DOM

    const span = document.createElement('span');
    span.textContent = title;
    span.style.fontWeight = 'bold';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete task';
    deleteBtn.classList.add('btn', 'btn-danger', 'ml-auto', 'delete-btn');

    const performBtn = document.createElement('button');
    performBtn.textContent = 'Perform task';
    performBtn.classList.add('btn', 'btn-success');

    const article = document.createElement('p');
    article.textContent = body;
    article.classList.add('mt-2', 'w-100');

    li.append(span);
    li.append(deleteBtn);
    li.append(article);
    li.append(performBtn);
    //console.log(li);
    return li;
  };

  //ф-ция добавляет в начало списка задач новую задачу
  function onFormSubmitHandler(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;
    //console.log(titleValue, bodyValue);
    if (!titleValue && !bodyValue) {
      alert('Пожалуйста введите title и body');
      return;
    }
    const task = createNewTask(titleValue, bodyValue);
    //console.log(task);
    const listItem = listItemTemplate(task);
    //console.log(listItem);
    listCotainer.insertAdjacentElement('afterbegin', listItem);
    form.reset();
  };

  //ф-ция создает новую задачу, на основе данных полученных с форм
  function createNewTask(title, body) {
    const newTask = {
      title: title,
      body: body,
      completed: false,
      _id: `task-${Math.random()}`
    }
    console.log(newTask);
    objOfTasks[newTask._id] = newTask; //добавляем в объект объектов новую задачу

    return {
      ...newTask //возвращаем копию задачи
    };
  };


  //ф-ция удаляет задачу из DOM дерева
  function deleteTaskFromHtml(confirmed, parent) {
    if (!confirmed) return;
    parent.remove();

    //если в объекте удалены все задачи вызываем ф-цию isArrEmpty
    if (Object.keys(objOfTasks).length === 0) isArrEmpty(objOfTasks);
  }

  //ф-ция удаляет задачу из объекта
  function deleteTaskFromObj(id) {
    //console.log(objOfTasks[id]);

    const {
      title
    } = objOfTasks[id] //достаем title из объекта objOfTasks title}

    const isConfirm = confirm(`Вы действительно хотите удалить задачу: ${title}`);
    //console.log(isConfirm);

    if (!isConfirm) return isConfirm; // если отказался удалять возвращаем isConfirm  с текущим состоянием
    delete objOfTasks[id];

    return isConfirm // если задача была удалена, возвращаем isConfirm с измененным состоянием

  }


  function onDeleteHandler({
    target
  }) {
    if (target.classList.contains('delete-btn')) { // если мы кликаем на элемент содержащий class 'delete-btn'
      const parent = target.closest('[data-task-id]'); // находим родителя (li) у этого элемента по data-task-id
      const id = parent.dataset.taskId; //получаем id родительско  элемента (li)

      //console.log(id);
      //console.log(parent);

      const confirmed = deleteTaskFromObj(id); //ф-ция удаляет задачу по id из объекта и  возвращает состояние isConfirm (true или false)
      //console.log(confirmed);

      deleteTaskFromHtml(confirmed, parent);
    };

  };

  //ф-ция выделяет задачу как выполненную
  function onPerformTask({
    target
  } = {}) {
    if (!target) return;

    if (target.classList.contains('btn-success')) {
      const parent = target.closest('[data-task-id]');
      const id = parent.dataset.taskId;
      parent.classList.toggle('active');

      if (parent.classList.contains('active')) { //если задача выполнена, то в объекте св-во completed = true
        objOfTasks[id].completed = true
      } else {
        objOfTasks[id].completed = false;
      }
    }
    return objOfTasks;
  };

  //ф-ция проверяет остались ли еще задачи
  (function isArrEmpty(obj) {
    if (Object.keys(obj).length === 0) {
      const div = document.createElement('div');
      div.style.textAlign = 'center';
      div.textContent = 'Задач нет';
      document.querySelector('.row').insertAdjacentElement('afterend', div);
    }
  }(arrOfTasks));


}(tasks))