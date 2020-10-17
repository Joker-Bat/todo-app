

var listController = (function() {

	var todo = function(id, title, description) {
		this.id = id;
		this.title = title;
		this.description = description;
	}

	var data = {
		todo: []
	}

	var getCurrentId = function(obj) {
		var idList, ids;
		idList = Object.values(obj);

		ids = idList.map(function(current) {
			return Number(current.id);
		});

		return ids;
	}


	return {
		addItem: function(title, description){
			var newItem, id;

			if(data.todo.length > 0) {
				id = (data.todo[data.todo.length - 1].id) + 1;
			} else {
				id = 0;
			}

			newItem = new todo(id, title, description);

			data.todo.push(newItem);

			return newItem;
		},

		getData: function() {
			return data;
		},

		removeItem: function(id) {
			var ids, index, values, listValues = [];

			ids = getCurrentId(data.todo);

			index = ids.indexOf(Number(id));

			if (index !== -1) {
				data.todo.splice(index, 1);
			}
		},

		updateItem: function(newId, newTitle, newDescription) {

			var listIds = getCurrentId(data.todo);
			var index = listIds.indexOf(Number(newId));
			data.todo[index].title = newTitle;
			data.todo[index].description = newDescription;	
		},

		getCurrentId: function(obj) {
			return getCurrentId(obj);
		},

		testing: function() {
			return data;
		}
	}


})();




var UIController = (function() {

	var DOMStrings = {
		add: document.querySelector('.add'),
		form: document.querySelector('.form__container'),
		save: document.querySelector('.form__page-button'),
		titleText: document.querySelector('.form__page-title-text'),
		descriptionText: document.querySelector('.form__page-description-text'),
		bottom: document.querySelector('.bottom'),
		delete: document.querySelector('.form__page-delete')
	}


	var getCurrentDate = function() {
		var today = new Date();
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Dec'];
		
		return {
			date: today.getDate(),
			month: months[today.getMonth()],
			year: today.getFullYear(),
			hour: today.getHours(),
			min: today.getMinutes()
		}
	}

	
	return {
		getInput: function() {
			return {
				title: DOMStrings.titleText.value,
				description: DOMStrings.descriptionText.value
			}
		},

		addListItem: function(obj) {
			var html, newHtml, today, date, month, year, hour, min;


			today = getCurrentDate();
			date = today.date;
			month = today.month;
			year = today.year;
			hour = today.hour;
			min = today.min;


			html = '<div class="item" id="%id%"><div class="item__title">%title%</div><div class="item__date">%date%  [%time%] </div></div>'

			newHtml = html.replace('%title%', obj.title);
			newHtml = newHtml.replace('%id%', obj.id);
			newHtml = newHtml.replace('%date%', date + ' ' + month + ' ' + year);
			newHtml = newHtml.replace('%time%', hour + ':' + min);

			DOMStrings.bottom.insertAdjacentHTML('beforeend', newHtml);
		},

		updateListItem: function(id, title) {
			var item, today, date, month, year, hour, min;

			item = document.getElementById(Number(id));

			today = getCurrentDate();
			date = today.date;
			month = today.month;
			year = today.year;
			hour = today.hour;
			min = today.min;

			item.children[0].innerText = title;

			item.children[1].innerText = date + ' ' + month + ' ' + year + '  ' + '[' + hour + ":" + min + ']';
		},

		removeListItem: function(id) {
			var item = document.getElementById(Number(id));
			item.parentNode.removeChild(item);
		},


		toggleForm: function() {
			DOMStrings.form.classList.toggle('show-form');
		},

		fillForm: function(title, description) {
			DOMStrings.titleText.value = title;
			DOMStrings.descriptionText.value = description;
		},


		getDOMStrings: function() {
			return DOMStrings;
		}
	} 


})();




var controller = (function(listCtrl, UICtrl) {

	var item = -1, currentItem;

	var DOM = UICtrl.getDOMStrings();

	var setupEventListeners = function() {	

		DOM.add.addEventListener('click', function() {
			clearFields();
			DOM.titleText.focus();
			UICtrl.toggleForm();
			item = -1;
		});



		DOM.save.addEventListener('click', function() {
			currentItem = listCtrl.getData().todo;
			var listIds = listCtrl.getCurrentId(currentItem);

			if (listIds.includes(Number(item))) {
				var newInput;
				newInput = UICtrl.getInput();
				if (newInput.title !== '' && newInput.description !== '') {

					listCtrl.updateItem(item, newInput.title, newInput.description);
					UICtrl.updateListItem(item, newInput.title);
					UICtrl.toggleForm();
				}	

			} else {

				var input = UICtrl.getInput();

				if (input.title !== '' && input.description !== '') {
					ctrlAddItem(input);
					UICtrl.toggleForm();
					clearFields();
				}
			}

			
		});

		DOM.bottom.addEventListener('click', function(event) {
			
			item = event.target.parentNode.id;

			currentItem = listCtrl.getData().todo;
			var listIds = listCtrl.getCurrentId(currentItem);
			var currentId = listIds.indexOf(Number(item));

			UICtrl.fillForm(currentItem[currentId].title, currentItem[currentId].description);
			UICtrl.toggleForm();
		});


		DOM.delete.addEventListener('click', function() {
			ctrlDeleteItem(item);
			UICtrl.toggleForm();
			item = -1;
		});

}

	

	var ctrlAddItem = function(input) {
		var curData;

		curData = listCtrl.getData().todo;

		listCtrl.addItem(input.title, input.description);

		UICtrl.addListItem(curData[curData.length - 1]);
	}

	var ctrlDeleteItem = function(id) {
		UICtrl.removeListItem(id);
		listCtrl.removeItem(id);
	}

	var clearFields = function() {
		DOM.titleText.value = '';
		DOM.descriptionText.value = '';
	}
	

	return {
		init: function() {
			setupEventListeners();
			console.log("Application Started!");
		}
	}



})(listController, UIController);

controller.init();





