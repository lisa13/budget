//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }


            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }



            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new element
            return newItem;
        },

        testing: function () {
            console.log(data);
        }
    };

})();


//UI CONTROLLER
// these are two standalone controllers they don't communicate and are unaware fo each other
var UIController = (function () {

    var DOMstrings = {
        inputTypes: '.add__type',
        inputDescritpion: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'

    };

    return {
        getInput: function () {

            return {
                type: document.querySelector(DOMstrings.inputTypes).value,
                description: document.querySelector(DOMstrings.inputDescritpion).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        addLisatItem(obj, type) {
            var html, newHtml, element;

            //create html with placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">-%value%</div><div class="item__percentage"></div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div> </div>'

            }

            //replace the placeholder with the actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);



            //insert html into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        getDomstrings: function () {
            return DOMstrings;
        }

    };




})();


//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEvnList = function () {
        var DOM = UIController.getDomstrings();

        document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);
        //Anywhere clicked on the document this function will fire
        document.addEventListener('keypress', function (event) {
            //some older browsers use which instead keycode so we cover both cases
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };


    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the item to the UI
        UICtrl.addLisatItem(newItem, input.type);



    };

    return {
        init: function () {
            console.log("the app ran");
            setupEvnList();
        }
    }

})(budgetController, UIController);

controller.init();