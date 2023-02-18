'use strict';

//setting up main title
const listTitle = document.querySelector('.today');
let today = new Date().toISOString().split('T')[0];
listTitle.textContent = today;

// given data interface
let tasksList = [
  {
    start: 0,
    duration: 15,
    title: 'Exercise',
  },
  {
    start: 25,
    duration: 30,
    title: 'Travel to work',
  },
  {
    start: 30,
    duration: 30,
    title: 'Plan day',
  },
  {
    start: 60,
    duration: 15,
    title: "Review yesterday's commits",
  },
  {
    start: 100,
    duration: 15,
    title: 'Code review',
  },
  {
    start: 180,
    duration: 90,
    title: 'Have lunch with John',
  },
  {
    start: 360,
    duration: 30,
    title: 'Skype call',
  },
  {
    start: 370,
    duration: 45,
    title: 'Follow up with designer',
  },
  {
    start: 405,
    duration: 30,
    title: 'Push up branch',
  },
];

//rendering time grid
const timeGrid = (() => {
  const todoContainer = document.querySelector('.todo-container');
  for (let hour = 8; hour <= 17; hour++) {
    if (hour < 17) {
      const timeBlock = document.createElement('div');
      timeBlock.className = 'time-block';
      timeBlock.innerHTML = `
    <p class="hour">${hour}:00</p>
    <p class="half-hour">${hour}:30</p>
    `;
      todoContainer.append(timeBlock);
    }

    if (hour === 17) {
      const timeBlock = document.createElement('div');
      timeBlock.className = 'time-block';
      timeBlock.innerHTML = `
    <p class="hour">${hour}:00</p>
    `;
      todoContainer.append(timeBlock);
    }
  }
})();

//rendering tasks on the page
const taskRender = function (arr) {
  const todoContainer = document.querySelector('.todo-container');
  let id = 1;
  //default task finish, left margin and width
  const tasks = tasksList.map(task => {
    task.finish = task.start + task.duration;
    task.left = 44;
    task.width = 200;
    task.id = id++;
    return task;
  });

  tasks.map(task => {
    //creating todo html
    const todo = document.createElement('div');
    todo.className = 'todo';
    todoContainer.append(todo);

    const todoTitle = document.createElement('p');
    todoTitle.className = 'todo-title';
    todo.append(todoTitle);

    todoTitle.textContent = task.title;

    //setting up conditionals for todo`s width and left margin
    for (let el in tasks) {
      if (
        task.finish > tasks[el].start &&
        task.start < tasks[el].start
        // ||
        // (task.end > tasks[el].start && task.end < tasks[el].end)
      ) {
        task.width = 200;
        tasks[el].width = 200;

        if (task.left === tasks[el].left) {
          tasks[el].left += 200;
        }
        if (task.left === 140 && tasks[i].left == 44) {
          tasks[el].left += 200;
        }
      }
    }

    todo.setAttribute(
      'style',
      `height: ${task.duration * 2}px; width: ${task.width}px; top: ${
        task.start * 2
      }px; left: ${task.left}px;`
    );

    return todo;
  });
};
taskRender();

// short modal with some functionality
const taskModal = (function () {
  const todos = document.querySelectorAll('.todo');
  const todoModal = document.querySelector('.todo-modal');

  todos.forEach(function (todo) {
    let duration = Number(todo.style.height.replace('px', ''));
    let start = Number(todo.style.top.replace('px', '')) / 2;
    let finish = (start * 2 + duration) / 2;

    let startHour = String((start - (start % 60)) / 60 + 8);
    let startMinute = String(start % 60);

    let finishHour = String((finish - (finish % 60)) / 60 + 8);
    let finishMinute = String(finish % 60);

    todo.addEventListener('click', () => {
      todoModal.classList.toggle('hidden');
      todoModal.innerHTML = `
      <div class="modal-detail">
          <p class="todo-modal-title">${todo.textContent}</p>
          <p class="todo-modal-start">from ${startHour.padStart(
            2,
            '0'
          )}:${startMinute.padStart(2, '0')}</p>
          <p class="todo-modal-end">to ${finishHour.padStart(
            2,
            '0'
          )}:${finishMinute.padStart(2, '0')}</p>
        </div>
        <div class="modal-buttons-block">
          <button class="modal-confirm" class="done">done</button>
          <button class="modal-reject">delete</button>
          <button class="modal-edit">edit</button>
        </div>
      `;

      // button done
      const modalBtnDone = document.querySelector('.modal-confirm');
      modalBtnDone.addEventListener('click', () => {
        todo.classList.toggle('done');
      });

      // button delete
      const modalBtnDelete = document.querySelector('.modal-reject');
      modalBtnDelete.addEventListener('click', () => {
        todoModal.classList.add('hidden');
        todo.remove();
      });
    });
  });
})();

// btn for adding new task
const addNewTask = (function () {
  const addBtn = document.querySelector('.add-new-event');
  const newTaskModal = document.querySelector('.add-new-task');
  const cancelBtn = document.querySelector('.btn-cancel-new');
  const confirmBtn = document.querySelector('.btn-add-new');
  const inputStart = document.getElementById('start');
  const inputFinish = document.getElementById('finish');
  const inputTitle = document.getElementById('title');

  addBtn.addEventListener('click', () => {
    newTaskModal.classList.toggle('hidden');
  });

  cancelBtn.addEventListener('click', () => {
    newTaskModal.classList.add('hidden');
  });

  confirmBtn.addEventListener('click', () => {
    let startHour = Number(inputStart.value.slice(0, 2));
    let startMinute = Number(inputStart.value.slice(3));
    console.log(startHour, startMinute);

    let finishHour = Number(inputFinish.value.slice(0, 2));
    let finishMinute = Number(inputFinish.value.slice(3));

    let startTime = (startHour - 8) * 60 + startMinute;
    let finishTime = (finishHour - 8) * 60 + finishMinute;

    if (startTime > 0 && finishTime < 540) {
      let addedTask = {
        start: startTime ?? 0,
        duration: finishTime - startTime || 540,
        title: inputTitle.value,
      };
      tasksList.push(addedTask);
      taskRender(tasksList);
    }
  });
})();
